import 'dotenv/config';
import express from 'express';
import directorRoutes from './routes/directorRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/directors', directorRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor rodando!'})
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
