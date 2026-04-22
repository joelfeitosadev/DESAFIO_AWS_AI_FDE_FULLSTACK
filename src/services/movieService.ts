import { prisma } from '../database/index.js';

interface CreateMovieInput {
  title: string;
  description?: string;
  releaseYear: number;
  genre: string;
  directorId: string;
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