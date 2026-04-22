import { prisma } from '../database/index.js';
import { Prisma } from '@prisma/client';

interface CreateMovieInput {
  title: string;
  description?: string;
  releaseYear: number;
  genre: string;
  directorId: string;
}

export interface MovieFilters {
  title?: string;
  genre?: string;
  releaseYear?: number;
}

export const createMovie = async (data: CreateMovieInput) => {
  const director = await prisma.director.findUnique({ where: { id: data.directorId } });

  if (!director) {
    throw new Error('Director not found');
  }

  const existingMovie = await prisma.movie.findFirst({
    where: {
      title: data.title,
      releaseYear: data.releaseYear,
      directorId: data.directorId,
    },
  });

  if (existingMovie) {
    throw new Error('Movie already exists for this director and year');
  }

  return prisma.movie.create({ data });
};

export const getAllMoviesByParams = async (filters: MovieFilters) => {
  const where: Prisma.MovieWhereInput = {};

  if (filters.title) where.title = { contains: filters.title };
  if (filters.genre) where.genre = filters.genre;
  if (filters.releaseYear) where.releaseYear = filters.releaseYear;

  return prisma.movie.findMany({ where });
};

export const getMovieById = async (id: string) => {
  return prisma.movie.findUnique({ where: { id } });
};

export const updateMovie = async (id: string, data: CreateMovieInput) => {
  const director = await prisma.director.findUnique({ where: { id: data.directorId } });

  if(!director) {
    throw new Error('Director not found');
  }

  const existingMovie = await prisma.movie.findFirst({
    where: {
      title: data.title,
      releaseYear: data.releaseYear,
      directorId: data.directorId,
    },
  });

  if (existingMovie && existingMovie.id !== id) {
    throw new Error('Movie already exists for this director and year');
  }

  return prisma.movie.update({
    where: { id },
    data,
  });
};

export const deleteMovie = async (id: string) => {
  return prisma.movie.delete({
    where: { id },
  });
};