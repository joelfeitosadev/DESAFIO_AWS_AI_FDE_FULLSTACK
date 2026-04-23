import { Prisma } from '@prisma/client';
import * as directorRepository from '../repositories/directorRepository.js';
import { NotFoundError } from '../interfaces/HttpError.js';
import type { DirectorInput } from '../interfaces/Director.js';

export const createDirector = async (data: DirectorInput) => {
  const exists = await directorRepository.findByName(data.name);
  if (exists) throw new Error('Director already exists');

  return directorRepository.create(data);
};

export const getAllDirectors = async () => {
  return directorRepository.findAll();
};

export const getDirectorById = async (id: string) => {
  return directorRepository.findById(id);
};

export const updateDirector = async (id: string, data: DirectorInput) => {
  try {
    const existingName = await directorRepository.findByName(data.name);
    if (existingName && existingName.id !== id) {
      throw new Error('Director name already exists');
    }

    return await directorRepository.update(id, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('Director not found');
    }
    throw error;
  }
};

export const deleteDirectorById = async (id: string) => {
  try {
    const hasMovies = await directorRepository.findFirstMovieByDirectorId(id);
    if (hasMovies) throw new Error('Cannot delete director with linked movies');

    return await directorRepository.deleteById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('Director not found');
    }
    throw error;
  }
};

export const getDirectorMovies = async (id: string) => {
  const director = await directorRepository.findById(id);
  if (!director) throw new NotFoundError('Director not found');

  return directorRepository.findMoviesByDirectorId(id);
};