import { prisma } from '../database/index.js';
import type { Director } from '@prisma/client';
import type { Movie } from '@prisma/client';
import type { DirectorInput } from '../interfaces/Director.js';

export const findByName = async (name: string): Promise<Director | null> => {
  return prisma.director.findUnique({
    where: { name }
  });
};

export const findById = async (id: string): Promise<Director | null> => {
  return prisma.director.findUnique({
    where: { id }
  });
};

export const findAll = async (): Promise<Director[]> => {
  return prisma.director.findMany();
};

export const create = async (data: DirectorInput): Promise<Director> => {
  return prisma.director.create({
    data: { name: data.name }
  });
};

export const update = async (id: string, data: DirectorInput): Promise<Director> => {
  return prisma.director.update({
    where: { id },
    data: { name: data.name }
  });
};

export const deleteById = async (id: string): Promise<Director> => {
  return prisma.director.delete({
    where: { id }
  });
};

export const findFirstMovieByDirectorId = async (directorId: string): Promise<Movie | null> => {
  return prisma.movie.findFirst({
    where: { directorId }
  });
};

export const findMoviesByDirectorId = async (directorId: string): Promise<Movie[]> => {
  return prisma.movie.findMany({
    where: { directorId }
  });
};