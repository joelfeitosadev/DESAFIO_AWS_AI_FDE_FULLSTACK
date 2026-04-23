import type { RequestHandler } from 'express';

export const validateDirector: RequestHandler = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }

  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({ error: 'Name must be a between 3 and 50 characters' });
  }

  next();
}

