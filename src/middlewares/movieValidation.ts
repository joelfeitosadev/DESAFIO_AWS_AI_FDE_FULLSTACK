import type { RequestHandler} from 'express';

export const validateMovie: RequestHandler = (req, res, next) => {
  const { title, genre, releaseYear, directorId, description } = req.body;

  if (!title || !genre || !releaseYear || !directorId) {
    return res.status(400).json({ error: 'title, genre, releaseYear and directorId are required' });
  }

  if (description && description.length > 255) {
    return res.status(400).json({ error: 'description must be at most 255 characters' });
  }

  const currentYear = new Date().getFullYear();
  if (typeof releaseYear !== 'number' || releaseYear > currentYear) {
    return res.status(400).json({ error: 'releaseYear must be a valid number and not in the future'})
  }

  next();
};