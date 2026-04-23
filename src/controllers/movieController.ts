import type { RequestHandler } from 'express';
import { createMovie, getAllMoviesByParams, getMovieById, updateMovie, deleteMovie } from '../services/movieService.js';
import { NotFoundError } from '../interfaces/HttpError.js';
import type { HttpError } from '../interfaces/HttpError.js'

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, releaseYear, genre, directorId } = req.body;
    const movie = await createMovie({ title, description, releaseYear, genre, directorId });

    res.status(201).json(movie);
  } catch (error) {
    const err = error as HttpError;
    if (error instanceof NotFoundError) {
      err.status = 404;
    } else if (err.message?.includes('already exists')) {
      err.status = 409;
    } else {
      err.status = 500;
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

export const getById: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id);

    if (!movie) {
      const err: HttpError = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(movie)
  } catch (error) {
    const err = error as HttpError;
    err.status = (error instanceof NotFoundError) ? 404 : 500;
    next(err);
  }
};

export const update: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await updateMovie(id, req.body);
    res.status(200).json(movie);
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof NotFoundError) {
      err.status = 404;
    } else if (err.message?.includes('already exists')) {
      err.status = 409;
    } else {
      err.status = 500;
    }
    next(err);
  }
};

export const remove: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteMovie(id);
    res.status(204).send();
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof NotFoundError) {
      err.status = 404;
    } else {
      err.status = 500;
    }
    next(err);
  }
};