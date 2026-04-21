import { Prisma } from '@prisma/client';
import type { RequestHandler} from 'express';
import { createDirector} from '../services/directorService.js'

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