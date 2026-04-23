import { prisma } from '../database/index.js';
import { Prisma } from '@prisma/client';
import type { Movie } from '@prisma/client'
import type { CreateMovieInput, MovieFilters } from '../interfaces/Movie.js';

export const save = async (data: CreateMovieInput): Promise<Movie> => {
  return prisma.movie.create({ data });
};

export const findByUniqueKeys = async (title: string, releaseYear: number, directorId: string): Promise<Movie | null> => {
  return prisma.movie.findFirst({
    where: { title, releaseYear, directorId },
  });
};

export const findMany = async (filters: MovieFilters): Promise<Movie[]> => {
  const where: Prisma.MovieWhereInput = {};
  if (filters.title) where.title = { contains: filters.title };
  if (filters.genre) where.genre = filters.genre;
  if (filters.releaseYear) where.releaseYear = filters.releaseYear;

  return prisma.movie.findMany({ where });
};

export const findById = async (id: string): Promise<Movie | null> => {
  return prisma.movie.findUnique({ where: { id } });
};

export const update = async (id: string, data: CreateMovieInput): Promise<Movie> => {
  return prisma.movie.update({ where: { id }, data });
};

export const deleteById = async (id: string): Promise<Movie> => {
  return prisma.movie.delete({ where: { id } });
};