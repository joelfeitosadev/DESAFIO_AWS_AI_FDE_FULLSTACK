import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../../src/app.js';
import { prismaMock } from '../../mocks/setup.js';
import { Prisma } from '@prisma/client';

const validPayload = {
  title: 'Dune',
  releaseYear: 2021,
  genre: 'Sci-Fi',
  directorId: '1',
  description: 'Um ótimo filme de ficção'
};

describe('Movie Routes', () => {
  describe('POST /movies', () => {
    it('Deve retornar 201', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.create.mockResolvedValue({ id: '10', ...validPayload });

      const response = await request(app).post('/movies').send(validPayload);
      expect(response.status).toBe(201);
    });

    it('Deve retornar 400 se faltar campo obrigatório', async () => {
      const response = await request(app).post('/movies').send({ title: 'Dune' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 400 se a descrição tiver mais de 255 caracteres', async () => {
      const longDesc = 'a'.repeat(256);
      const response = await request(app).post('/movies').send({ ...validPayload, description: longDesc });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 400 se ano de lançamento for no futuro', async () => {
      const futureYear = new Date().getFullYear() + 1;
      const response = await request(app).post('/movies').send({ ...validPayload, releaseYear: futureYear });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 404 se diretor não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      const response = await request(app).post('/movies').send(validPayload);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 409 se filme for duplicado', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue({ id: '10', ...validPayload });
      const response = await request(app).post('/movies').send(validPayload);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.director.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).post('/movies').send(validPayload);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /movies', () => {
    it('Deve retornar 200 com query params', async () => {
      prismaMock.movie.findMany.mockResolvedValue([]);
      const response = await request(app).get('/movies?title=Dune&releaseYear=2021&genre=Sci-Fi');
      expect(response.status).toBe(200);
    });

    it('Deve retornar 500 em caso de erro interno', async () => {
      prismaMock.movie.findMany.mockRejectedValue(new Error('Erro DB'));
      const response = await request(app).get('/movies');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /movies/:id', () => {
    it('Deve retornar 200 e o filme', async () => {
      prismaMock.movie.findUnique.mockResolvedValue({ id: '10', ...validPayload });
      const response = await request(app).get('/movies/10');
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Dune'); 
    });

    it('Deve retornar 404 se não achar', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/movies/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.movie.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/movies/10');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 404 se NotFoundError for lançado (cobertura do catch)', async () => {
      const { NotFoundError } = await import('../../../src/interfaces/HttpError.js');
      prismaMock.movie.findUnique.mockRejectedValue(new NotFoundError('Not found'));
      const response = await request(app).get('/movies/10');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not found');
    });
  });

  describe('PUT /movies/:id', () => {
    it('Deve retornar 200', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.update.mockResolvedValue({ id: '10', ...validPayload });

      const response = await request(app).put('/movies/10').send(validPayload);
      expect(response.status).toBe(200);
    });

    it('Deve retornar 404 se filme não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '5' }));

      const response = await request(app).put('/movies/999').send(validPayload);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 409 se atualizar para filme já existente', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue({ id: '11', ...validPayload });

      const response = await request(app).put('/movies/10').send(validPayload);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno no update', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.update.mockRejectedValue(new Error('Database error'));
      const response = await request(app).put('/movies/10').send(validPayload);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /movies/:id', () => {
    it('Deve retornar 204', async () => {
      prismaMock.movie.delete.mockResolvedValue({ id: '10', ...validPayload });
      const response = await request(app).delete('/movies/10');
      expect(response.status).toBe(204);
    });

    it('Deve retornar 404 se não achar', async () => {
      prismaMock.movie.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '5' }));
      const response = await request(app).delete('/movies/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar 500 em erro interno', async () => {
      prismaMock.movie.delete.mockRejectedValue(new Error('Database error'));
      const response = await request(app).delete('/movies/10');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});