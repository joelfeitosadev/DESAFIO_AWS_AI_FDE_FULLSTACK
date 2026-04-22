import { Prisma } from '@prisma/client';
import type { RequestHandler} from 'express';
import { createDirector, getAllDirectors, getDirectorById, updateDirector, deleteDirectorById, getDirectorMovies } from '../services/directorService.js'
import type { HttpError } from '../interfaces/HttpError.js'

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const director = await createDirector({ name });

    res.status(201).json(director);
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof Error && error.message) {
      err.status = error.message.includes('already exists') ? 409 : 400;
    } else {
      err.status = 500;
      err.message = 'Internal server error';
    }

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

    if(!director) {
      const err = new Error('Director not found') as HttpError;
      err.status = 404;
      return next(err);
    }
    res.status(200).json(director);
  } catch (error) {
    next(error);
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

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Director not found';
    } else if (error instanceof Error && error.message) {
      err.status = error.message.includes('already exists') ? 409 : 400;
    } else {
      err.status = 500;
      err.message = 'Internal server error';
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

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Director not found';
    } else if (error instanceof Error && error.message) {
      err.status = error.message.includes('linked movies') ? 409 : 400;
    } else {
      err.status = 500;
      err.message = 'Internal server error';
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

    if (error instanceof Error && error.message === 'Director not found') {
      err.status = 404;
    } else {
      err.status = 500;
      err.message = 'Internal server error';
    }

    next(err);
  }
};