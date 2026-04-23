import { describe, it, expect } from 'vitest';
import { prismaMock } from '../../mocks/setup.js';
import { createMovie, getAllMoviesByParams, getMovieById, updateMovie, deleteMovie } from '../../../src/services/movieService.js';

const mockMovieInput = {
  title: 'Dune',
  releaseYear: 2021,
  genre: 'Sci-Fi',
  directorId: '1',
  description: 'Um ótimo filme de ficção'
};

describe('Movie Service', () => {
  describe('createMovie', () => {
    it('Deve criar filme com sucesso', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.create.mockResolvedValue({ id: '10', ...mockMovieInput });

      const result = await createMovie(mockMovieInput);
      expect(result.id).toBe('10');
    });

    it('Deve permitir criar filme com mesmo título se ano ou diretor forem diferentes', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '2', name: 'Outro Diretor' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.create.mockResolvedValue({ id: '11', ...mockMovieInput, directorId: '2' });

      const result = await createMovie({ ...mockMovieInput, directorId: '2' });
      expect(result.id).toBe('11');
    });

    it('Deve lançar erro 404 se diretor não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      await expect(createMovie(mockMovieInput)).rejects.toThrow('Director not found');
    });

    it('Deve lançar erro 409 se filme já existir (title, year, director)', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue({ id: '10', ...mockMovieInput });
      await expect(createMovie(mockMovieInput)).rejects.toThrow('Movie already exists for this director and year');
    });
  });

  describe('getAllMoviesByParams', () => {
    it('Deve retornar filmes aplicando filtros', async () => {
      prismaMock.movie.findMany.mockResolvedValue([]);
      await getAllMoviesByParams({ title: 'Dune', genre: 'Sci-Fi', releaseYear: 2021 });

      expect(prismaMock.movie.findMany).toHaveBeenCalledWith({
        where: { title: { contains: 'Dune' }, genre: 'Sci-Fi', releaseYear: 2021 }
      });
    });
  });

  describe('getMovieById', () => {
    it('Deve retornar filme', async () => {
      prismaMock.movie.findUnique.mockResolvedValue({ id: '10', ...mockMovieInput });
      const result = await getMovieById('10');
      expect(result?.title).toBe('Dune');
    });
  });

  describe('updateMovie', () => {
    it('Deve atualizar filme com sucesso', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Denis' });
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.movie.update.mockResolvedValue({ id: '10', ...mockMovieInput, title: 'Dune 2' });

      const result = await updateMovie('10', { ...mockMovieInput, title: 'Dune 2' });
      expect(result.title).toBe('Dune 2');
    });

    it('Deve falhar se diretor não existir', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      await expect(updateMovie('10', mockMovieInput)).rejects.toThrow('Director not found');
    });
  });

  describe('deleteMovie', () => {
    it('Deve deletar filme com sucesso', async () => {
      prismaMock.movie.delete.mockResolvedValue({ id: '10', ...mockMovieInput });
      const result = await deleteMovie('10');
      expect(result.id).toBe('10');
    });
  });
});