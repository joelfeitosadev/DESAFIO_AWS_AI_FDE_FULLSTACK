import 'dotenv/config';
import express from 'express';
import directorRoutes from './routes/directorRoutes.js';
import moviesRoutes from './routes/movieRoutes.js';
import { requestLogger } from './middlewares/logger.js';
import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from './interfaces/HttpError.js'
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync(new URL('../swagger-output.json', import.meta.url), 'utf-8'));

export const app = express();
const PORT = process.env.PORT || 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(requestLogger);

app.use('/directors', directorRoutes);
app.use('/movies', moviesRoutes)

app.get('/health', (req, res) => {
  // #swagger.tags = ['Health']
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!'})
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  console.error(`[ERR] ${req.method} ${req.url} - ${err.message}`);
  res.status(status).json({ error: err.message || 'Internal server error' });
});