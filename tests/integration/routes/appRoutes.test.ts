import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../../src/app.js';

describe('App Routes', () => {
  describe('GET /health', () => {
    it('Deve retornar 200 com status OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'OK', message: 'Servidor rodando!' });
    });
  });
});
