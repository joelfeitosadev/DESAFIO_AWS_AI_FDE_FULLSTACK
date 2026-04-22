import { Prisma } from '@prisma/client';
import type { RequestHandler } from 'express';
import { createMovie, getAllMoviesByParams, getMovieById, updateMovie, deleteMovie } from '../services/movieService.js';

export const create: RequestHandler = async (req, res) => {
  try {
    const { title, description, releaseYear, genre, directorId } = req.body;
    const movie = await createMovie({ title, description, releaseYear, genre, directorId });
    
    res.status(201).json(movie);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllByParams: RequestHandler = async (req, res) => {
  try {
    const { genre, releaseYear } = req.query;
    const filters: { genre?: string; releaseYear?: number } = {};

    if (genre) { filters.genre = String(genre); }
    if (releaseYear) { filters.releaseYear = Number(releaseYear); }

    const movies = await getAllMoviesByParams(filters);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id as string)

    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, releaseYear, genre, directorId } = req.body;

    const movie = await updateMovie(id as string, {
      title,
      description,
      releaseYear,
      genre,
      directorId,
    });

    res.status(200).json(movie);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found' }); // Estava Director
    }
    if (error instanceof Error) {
      if (error.message.includes('already exists')) return res.status(409).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMovie(id as string);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found' }); // Estava Director
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};