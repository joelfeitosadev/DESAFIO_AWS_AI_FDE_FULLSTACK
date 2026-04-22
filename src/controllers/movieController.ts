import type { RequestHandler } from 'express';
import { createMovie } from '../services/movieService.js';

export const create: RequestHandler = async (req, res) => {
  try {
    const { title, description, releaseYear, genre, directorId } = req.body;

    if (!title || !releaseYear || !genre || !directorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const movie = await createMovie({ title, description, releaseYear, genre, directorId });
    res.status(201).json(movie);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};