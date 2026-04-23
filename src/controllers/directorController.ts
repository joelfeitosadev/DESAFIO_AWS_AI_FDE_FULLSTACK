import type { RequestHandler} from 'express';
import { createDirector, getAllDirectors, getDirectorById, updateDirector, deleteDirectorById, getDirectorMovies } from '../services/directorService.js'
import { NotFoundError } from '../interfaces/HttpError.js';
import type { HttpError } from '../interfaces/HttpError.js'

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const director = await createDirector({ name });

    res.status(201).json(director);
  } catch (error) {
    const err = error as HttpError;
    err.status = (err.message?.includes('already exists')) ? 409 : 400;
    next(err);
  }
};

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const directors = await getAllDirectors();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const director = await getDirectorById(id);

    if (!director) {
      throw new NotFoundError('Director not found');
    }
    res.status(200).json(director);
  } catch (error) {
    const err = error as HttpError;
    err.status = (error instanceof NotFoundError) ? 404 : 500;
    next(err);
  }
};

export const update: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const director = await updateDirector(id, { name });
    res.status(200).json(director);
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
    await deleteDirectorById(id);
    res.status(204).send();
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof NotFoundError) {
      err.status = 404;
    } else if (err.message?.includes('linked movies')) {
      err.status = 409;
    } else {
      err.status = 500;
    }
    next(err);
  }
};

export const getMovies: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movies = await getDirectorMovies(id);
    res.status(200).json(movies);
  } catch (error) {
    const err = error as HttpError;
    err.status = (error instanceof NotFoundError) ? 404 : 500;
    next(err);
  }
};