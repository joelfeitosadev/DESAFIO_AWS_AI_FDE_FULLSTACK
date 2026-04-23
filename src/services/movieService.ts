import { Prisma } from '@prisma/client';
import { NotFoundError } from '../interfaces/HttpError.js';
import * as movieRepository from '../repositories/movieRepository.js';
import * as directorRepository from '../repositories/directorRepository.js';
import type { CreateMovieInput, MovieFilters } from '../interfaces/Movie.js';

export const createMovie = async (data: CreateMovieInput) => {
  const director = await directorRepository.findById(data.directorId);
  if (!director) throw new NotFoundError('Director not found');

  const existingMovie = await movieRepository.findByUniqueKeys(data.title, data.releaseYear, data.directorId);
  if (existingMovie) throw new Error('Movie already exists for this director and year');

  return movieRepository.save(data);
};

export const getAllMoviesByParams = async (filters: MovieFilters) => {
  return movieRepository.findMany(filters);
};

export const getMovieById = async (id: string) => {
  return movieRepository.findById(id);
};

export const updateMovie = async (id: string, data: CreateMovieInput) => {
  const director = await directorRepository.findById(data.directorId);
  if (!director) throw new NotFoundError('Director not found');

  try {
    const existingMovie = await movieRepository.findByUniqueKeys(data.title, data.releaseYear, data.directorId);
    if (existingMovie && existingMovie.id !== id) {
      throw new Error('Movie already exists for this director and year');
    }

    return await movieRepository.update(id, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('Movie not found');
    }
    throw error;
  }
};

export const deleteMovie = async (id: string) => {
  try {
    return await movieRepository.deleteById(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('Movie not found');
    }
    throw error;
  }
};