import 'dotenv/config';
import express from 'express';
import directorRoutes from './routes/directorRoutes.js';
import moviesRoutes from './routes/movieRoutes.js';
import { requestLogger } from './middlewares/logger.js';
import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from './interfaces/HttpError.js'

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(requestLogger);

app.use('/directors', directorRoutes);
app.use('/movies', moviesRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!'})
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  console.error(`[ERR] ${req.method} ${req.url} - ${err.message}`);
  res.status(status).json({ error: err.message || 'Internal server error' });
});