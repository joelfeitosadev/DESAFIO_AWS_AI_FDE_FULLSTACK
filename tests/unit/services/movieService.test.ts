import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as movieRepository from '../../../src/repositories/movieRepository.js';
import * as directorRepository from '../../../src/repositories/directorRepository.js';
import { createMovie, getAllMoviesByParams, getMovieById, updateMovie, deleteMovie } from '../../../src/services/movieService.js';
import { NotFoundError } from '../../../src/interfaces/HttpError.js';

vi.mock('../../../src/repositories/movieRepository.js');
vi.mock('../../../src/repositories/directorRepository.js');

const mockMovieInput = {
  title: 'Dune',
  releaseYear: 2021,
  genre: 'Sci-Fi',
  directorId: '1',
  description: 'Um ótimo filme de ficção'
};

describe('Movie Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMovie', () => {
    it('Deve criar filme com sucesso', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '1', name: 'Denis' });
      vi.mocked(movieRepository.findByUniqueKeys).mockResolvedValue(null);
      vi.mocked(movieRepository.save).mockResolvedValue({ id: '10', ...mockMovieInput });

      const result = await createMovie(mockMovieInput);
      expect(result.id).toBe('10');
      expect(movieRepository.save).toHaveBeenCalledWith(mockMovieInput);
    });

    it('Deve permitir criar filme com mesmo título se ano ou diretor forem diferentes', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '2', name: 'Outro Diretor' });
      vi.mocked(movieRepository.findByUniqueKeys).mockResolvedValue(null);
      vi.mocked(movieRepository.save).mockResolvedValue({ id: '11', ...mockMovieInput, directorId: '2' });

      const result = await createMovie({ ...mockMovieInput, directorId: '2' });
      expect(result.id).toBe('11');
    });

    it('Deve lançar NotFoundError se diretor não existir', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue(null);
      await expect(createMovie(mockMovieInput)).rejects.toThrow(NotFoundError);
    });

    it('Deve lançar erro se filme já existir (title, year, director)', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '1', name: 'Denis' });
      vi.mocked(movieRepository.findByUniqueKeys).mockResolvedValue({ id: '10', ...mockMovieInput });
      await expect(createMovie(mockMovieInput)).rejects.toThrow('Movie already exists for this director and year');
    });
  });

  describe('getAllMoviesByParams', () => {
    it('Deve retornar filmes aplicando filtros', async () => {
      vi.mocked(movieRepository.findMany).mockResolvedValue([]);
      await getAllMoviesByParams({ title: 'Dune', genre: 'Sci-Fi', releaseYear: 2021 });

      expect(movieRepository.findMany).toHaveBeenCalledWith({ title: 'Dune', genre: 'Sci-Fi', releaseYear: 2021 });
    });
  });

  describe('getMovieById', () => {
    it('Deve retornar filme', async () => {
      vi.mocked(movieRepository.findById).mockResolvedValue({ id: '10', ...mockMovieInput });
      const result = await getMovieById('10');
      expect(result?.title).toBe('Dune');
    });
  });

  describe('updateMovie', () => {
    it('Deve atualizar filme com sucesso', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '1', name: 'Denis' });
      vi.mocked(movieRepository.findByUniqueKeys).mockResolvedValue(null);
      vi.mocked(movieRepository.update).mockResolvedValue({ id: '10', ...mockMovieInput, title: 'Dune 2' });

      const result = await updateMovie('10', { ...mockMovieInput, title: 'Dune 2' });
      expect(result.title).toBe('Dune 2');
    });

    it('Deve falhar com NotFoundError se diretor não existir', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue(null);
      await expect(updateMovie('10', mockMovieInput)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteMovie', () => {
    it('Deve deletar filme com sucesso', async () => {
      vi.mocked(movieRepository.deleteById).mockResolvedValue({ id: '10', ...mockMovieInput });
      const result = await deleteMovie('10');
      expect(result.id).toBe('10');
    });
  });
});