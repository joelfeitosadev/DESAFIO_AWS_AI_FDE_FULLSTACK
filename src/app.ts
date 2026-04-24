import 'dotenv/config';
import express from 'express';
import directorRoutes from './routes/directorRoutes.js';
import moviesRoutes from './routes/movieRoutes.js';
import { requestLogger } from './middlewares/logger.js';
import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from './interfaces/HttpError.js'
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

const swaggerPath = path.join(process.cwd(), 'swagger-output.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

export const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(requestLogger);

app.use('/directors', directorRoutes);
app.use('/movies', moviesRoutes)

app.get('/health', (req, res) => {
  // #swagger.tags = ['Health']
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!'})
});

app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  console.error(`[ERR] ${req.method} ${req.url} - ${err.message}`);
  res.status(status).json({ error: err.message || 'Internal server error' });
});