import { Prisma } from '@prisma/client';
import type { RequestHandler } from 'express';
import { createMovie, getAllMoviesByParams, getMovieById, updateMovie, deleteMovie } from '../services/movieService.js';
import type { HttpError } from './directorController.js'

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, releaseYear, genre, directorId } = req.body;
    const movie = await createMovie({ title, description, releaseYear, genre, directorId });

    res.status(201).json(movie);
  } catch (error) {
    const err = error as HttpError;
    if (err.message.includes('already exists')) {
      err.status = 409;
    } else if (err.message === 'Director not found') {
      err.status = 404;
    } else {
      err.status = 400;
    }
    next(err);
  }
};

export const getAllByParams: RequestHandler = async (req, res, next) => {
  try {
    const { title, genre, releaseYear } = req.query;
    const filters: { title?: string; genre?: string; releaseYear?: number } = {};

    if (title) { filters.title = String(title); }
    if (genre) { filters.genre = String(genre); }
    if (releaseYear) { filters.releaseYear = Number(releaseYear); }

    const movies = await getAllMoviesByParams(filters);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id as string)

    if (!movie) {
      const err: HttpError = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(movie)
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
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
    const err = error as HttpError;

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Movie not found';
    } else if (err.message.includes('already exists')) {
      err.status = 409;
    } else if (err.message === 'Director not found') {
      err.status = 404;
    } else {
      err.status = 400;
    }

    next(err);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteMovie(id as string);
    res.status(204).send();
  } catch (error) {
    const err = error as HttpError;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Movie not found';
    }
    next(err);
  }
};