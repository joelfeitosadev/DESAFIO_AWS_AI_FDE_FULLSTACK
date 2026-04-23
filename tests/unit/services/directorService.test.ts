import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as directorRepository from '../../../src/repositories/directorRepository.js';
import { createDirector, getAllDirectors, getDirectorById, updateDirector, deleteDirectorById, getDirectorMovies } from '../../../src/services/directorService.js';
import { NotFoundError } from '../../../src/interfaces/HttpError.js';

vi.mock('../../../src/repositories/directorRepository.js');

describe('Director Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDirector', () => {
    it('Deve criar um diretor com sucesso', async () => {
      vi.mocked(directorRepository.findByName).mockResolvedValue(null);
      vi.mocked(directorRepository.create).mockResolvedValue({ id: '1', name: 'Nolan' });

      const result = await createDirector({ name: 'Nolan' });
      expect(result.id).toBe('1');
      expect(directorRepository.create).toHaveBeenCalledWith({ name: 'Nolan' });
    });

    it('Deve lançar erro se diretor já existe', async () => {
      vi.mocked(directorRepository.findByName).mockResolvedValue({ id: '1', name: 'Nolan' });
      await expect(createDirector({ name: 'Nolan' })).rejects.toThrow('Director already exists');
    });
  });

  describe('getAllDirectors', () => {
    it('Deve retornar lista de diretores', async () => {
      vi.mocked(directorRepository.findAll).mockResolvedValue([{ id: '1', name: 'Nolan' }]);
      const result = await getAllDirectors();
      expect(result).toHaveLength(1);
    });
  });

  describe('getDirectorById', () => {
    it('Deve retornar um diretor pelo ID', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '1', name: 'Nolan' });
      const result = await getDirectorById('1');
      expect(result?.name).toBe('Nolan');
    });
  });

  describe('updateDirector', () => {
    it('Deve atualizar um diretor com sucesso', async () => {
      vi.mocked(directorRepository.findByName).mockResolvedValue(null);
      vi.mocked(directorRepository.update).mockResolvedValue({ id: '1', name: 'Tarantino' });

      const result = await updateDirector('1', { name: 'Tarantino' });
      expect(result.name).toBe('Tarantino');
    });

    it('Deve lançar erro se novo nome já existe em outro diretor', async () => {
      vi.mocked(directorRepository.findByName).mockResolvedValue({ id: '2', name: 'Tarantino' });
      await expect(updateDirector('1', { name: 'Tarantino' })).rejects.toThrow('Director name already exists');
    });
  });

  describe('deleteDirectorById', () => {
    it('Deve deletar um diretor com sucesso', async () => {
      vi.mocked(directorRepository.findFirstMovieByDirectorId).mockResolvedValue(null);
      vi.mocked(directorRepository.deleteById).mockResolvedValue({ id: '1', name: 'Nolan' });

      const result = await deleteDirectorById('1');
      expect(result.id).toBe('1');
    });

    it('Deve lançar erro se diretor possuir filmes', async () => {
      vi.mocked(directorRepository.findFirstMovieByDirectorId).mockResolvedValue({
        id: '10', title: 'Inception', releaseYear: 2010, genre: 'Sci-Fi', directorId: '1', description: null
      });
      await expect(deleteDirectorById('1')).rejects.toThrow('Cannot delete director with linked movies');
    });
  });

  describe('getDirectorMovies', () => {
    it('Deve retornar filmes do diretor', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue({ id: '1', name: 'Nolan' });
      vi.mocked(directorRepository.findMoviesByDirectorId).mockResolvedValue([{
        id: '10', title: 'Inception', releaseYear: 2010, genre: 'Sci-Fi', directorId: '1', description: null
      }]);

      const result = await getDirectorMovies('1');
      expect(result).toHaveLength(1);
    });

    it('Deve lançar NotFoundError se diretor não for encontrado', async () => {
      vi.mocked(directorRepository.findById).mockResolvedValue(null);
      await expect(getDirectorMovies('1')).rejects.toThrow(NotFoundError);
    });
  });
});