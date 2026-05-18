import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../../src/app.js';
import { prismaMock } from '../../mocks/setup.js';
import { Prisma } from '@prisma/client';

describe('Director Routes', () => {
  describe('POST /directors', () => {
    it('Deve retornar 201', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      prismaMock.director.create.mockResolvedValue({ id: '1', name: 'Tarantino' });

      const response = await request(app).post('/directors').send({ name: 'Tarantino' });
      expect(response.status).toBe(201);
    });

    it('Deve retornar 400 se nome não for uma string', async () => {
      const response = await request(app).post('/directors').send({ name: 123 });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 400 se nome menor que 3 chars', async () => {
      const response = await request(app).post('/directors').send({ name: 'A' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 400 se nome maior que 50 chars', async () => {
      const longName = 'a'.repeat(51);
      const response = await request(app).post('/directors').send({ name: longName });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 409 se nome já existe', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      const response = await request(app).post('/directors').send({ name: 'Nolan' });
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).post('/directors').send({ name: 'Scorsese' });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /directors', () => {
    it('Deve retornar 200 e lista', async () => {
      prismaMock.director.findMany.mockResolvedValue([]);
      const response = await request(app).get('/directors');
      expect(response.status).toBe(200);
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findMany.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/directors');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 com mensagem padrão se erro não tiver message', async () => {
      const error = new Error();
      error.message = '';
      prismaMock.director.findMany.mockRejectedValue(error);
      const response = await request(app).get('/directors');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /directors/:id', () => {
    it('Deve retornar 200 se achar diretor', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      const response = await request(app).get('/directors/1');
      expect(response.status).toBe(200);
    });

    it('Deve retornar 404 se não achar', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/directors/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/directors/1');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /directors/:id', () => {
    it('Deve retornar 200 ao atualizar', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      prismaMock.director.update.mockResolvedValue({ id: '1', name: 'Nolan 2' });
      const response = await request(app).put('/directors/1').send({ name: 'Nolan 2' });
      expect(response.status).toBe(200);
    });

    it('Deve retornar 404 se não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      prismaMock.director.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '5' }));
      const response = await request(app).put('/directors/999').send({ name: 'Nolan 2' });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 400 se nome menor que 3 chars', async () => {
      const response = await request(app).put('/directors/1').send({ name: 'A' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 409 se nome já existe', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '2', name: 'Nolan' });
      const response = await request(app).put('/directors/1').send({ name: 'Nolan' });
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).put('/directors/1').send({ name: 'Nolan 2' });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /directors/:id', () => {
    it('Deve retornar 204 ao excluir', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.director.delete.mockResolvedValue({ id: '1', name: 'Nolan' });
      const response = await request(app).delete('/directors/1');
      expect(response.status).toBe(204);
    });

    it('Deve retornar 409 se possuir filmes vinculados', async () => {
      prismaMock.movie.findFirst.mockResolvedValue({ id: '10', title: 'A', releaseYear: 2000, genre: 'B', directorId: '1', description: null });
      const response = await request(app).delete('/directors/1');
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 404 se não achar', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.director.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '5' }));
      const response = await request(app).delete('/directors/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.movie.findFirst.mockRejectedValue(new Error('Database error'));
      const response = await request(app).delete('/directors/1');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /directors/:id/movies', () => {
    it('Deve retornar 200 com os filmes', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      prismaMock.movie.findMany.mockResolvedValue([]);
      const response = await request(app).get('/directors/1/movies');
      expect(response.status).toBe(200);
    });

    it('Deve retornar 404 se diretor não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/directors/999/movies');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/directors/1/movies');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});