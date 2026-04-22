import { Prisma } from '@prisma/client';
import type { RequestHandler} from 'express';
import { createDirector, getAllDirectors, getDirectorById, updateDirector, deleteDirectorById } from '../services/directorService.js'

export const create: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }

    const director = await createDirector({ name });
    res.status(201).json(director);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(400).json({ error: 'Invalid data' });
  }
};

export const getAll: RequestHandler = async (req, res) => {
  try {
    const directors = await getAllDirectors();
    res.status(200).json(directors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const director = await getDirectorById(id as string);

    if(!director) {
      return res.status(404).json({ error: 'Director not found' });
    }
    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const director = await updateDirector(id as string, { name });
    res.status(200).json(director);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Director not found' });
      }
    }
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDirectorById(id as string);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Director not found' });
      }
    }
    if (error instanceof Error) {
      if (error.message.includes('linked movies')) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};