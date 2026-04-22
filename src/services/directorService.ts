import { prisma } from '../database/index.js';

export interface DirectorInput {
  name: string;
}

export const createDirector = async (data: DirectorInput) => {
  const exists = await prisma.director.findUnique({ where: { name: data.name } });
  if (exists) {
    throw new Error('Director already exists');
  }

  return prisma.director.create({ data: { name: data.name } });
};

export const getAllDirectors = async () => {
  return prisma.director.findMany();
};

export const getDirectorById = async (id: string) => {
  return prisma.director.findUnique({ where: { id } });
};

export const updateDirector = async (id: string, data: DirectorInput) => {
  const existingName = await prisma.director.findUnique({ where: { name: data.name } });
  if (existingName && existingName.id !== id) {
    throw new Error('Director name already exists');
  }

  return prisma.director.update({
    where: { id },
    data: { name: data.name }
  });
};

export const deleteDirectorById = async (id: string) => {
  const hasMovies = await prisma.movie.findFirst({ where: { directorId: id } })
  if (hasMovies) {
    throw new Error('Cannot delete director with linked movies');
  }

  return prisma.director.delete({ where: { id }});
}