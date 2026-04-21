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