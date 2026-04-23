import { describe, it, expect } from 'vitest';
import { prismaMock } from '../../mocks/setup.js';
import { createDirector, getAllDirectors, getDirectorById, updateDirector, deleteDirectorById, getDirectorMovies } from '../../../src/services/directorService.js';

describe('Director Service', () => {
  describe('createDirector', () => {
    it('Deve criar um diretor com sucesso', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      prismaMock.director.create.mockResolvedValue({ id: '1', name: 'Nolan' });

      const result = await createDirector({ name: 'Nolan' });
      expect(result.id).toBe('1');
    });

    it('Deve lançar erro 409 se diretor já existe', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      await expect(createDirector({ name: 'Nolan' })).rejects.toThrow('Director already exists');
    });
  });

  describe('getAllDirectors', () => {
    it('Deve retornar lista de diretores', async () => {
      prismaMock.director.findMany.mockResolvedValue([{ id: '1', name: 'Nolan' }]);
      const result = await getAllDirectors();
      expect(result).toHaveLength(1);
    });
  });

  describe('getDirectorById', () => {
    it('Deve retornar um diretor pelo ID', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      const result = await getDirectorById('1');
      expect(result?.name).toBe('Nolan');
    });
  });

  describe('updateDirector', () => {
    it('Deve atualizar um diretor com sucesso', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      prismaMock.director.update.mockResolvedValue({ id: '1', name: 'Tarantino' });

      const result = await updateDirector('1', { name: 'Tarantino' });
      expect(result.name).toBe('Tarantino');
    });

    it('Deve lançar erro 409 se novo nome já existe em outro diretor', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '2', name: 'Tarantino' });
      await expect(updateDirector('1', { name: 'Tarantino' })).rejects.toThrow('Director name already exists');
    });
  });

  describe('deleteDirectorById', () => {
    it('Deve deletar um diretor com sucesso', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null);
      prismaMock.director.delete.mockResolvedValue({ id: '1', name: 'Nolan' });

      const result = await deleteDirectorById('1');
      expect(result.id).toBe('1');
    });

    it('Deve lançar erro 409 se diretor possuir filmes', async () => {
      prismaMock.movie.findFirst.mockResolvedValue({ id: '10', title: 'Inception', releaseYear: 2010, genre: 'Sci-Fi', directorId: '1', description: null });
      await expect(deleteDirectorById('1')).rejects.toThrow('Cannot delete director with linked movies');
    });
  });

  describe('getDirectorMovies', () => {
    it('Deve retornar filmes do diretor', async () => {
      prismaMock.director.findUnique.mockResolvedValue({ id: '1', name: 'Nolan' });
      prismaMock.movie.findMany.mockResolvedValue([{ id: '10', title: 'Inception', releaseYear: 2010, genre: 'Sci-Fi', directorId: '1', description: null }]);

      const result = await getDirectorMovies('1');
      expect(result).toHaveLength(1);
    });

    it('Deve lançar erro 404 se diretor não for encontrado', async () => {
      prismaMock.director.findUnique.mockResolvedValue(null);
      await expect(getDirectorMovies('1')).rejects.toThrow('Director not found');
    });
  });
});