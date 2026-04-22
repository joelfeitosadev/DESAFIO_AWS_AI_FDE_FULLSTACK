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
    err.status = err.message.includes('already exists') ? 409 : 400;
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

export const getById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const director = await getDirectorById(id as string);

    if(!director) {
      return res.status(404).json({ error: 'Director not found' });
    }
    res.status(200).json(director);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const director = await updateDirector(id as string, { name });
    res.status(200).json(director);
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Director not found';
    } else {
      err.status = err.message.includes('already exists') ? 409 : 400;
    }

    next(err);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteDirectorById(id as string);
    res.status(204).send();
  } catch (error) {
    const err = error as HttpError;

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      err.status = 404;
      err.message = 'Director not found';
    } else if (err.message.includes('linked movies')) {
      err.status = 409;
    }

    next(err);
  }
};

export const getMovies: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movies = await getDirectorMovies(id as string);
    res.status(200).json(movies);
  } catch (error) {
    const err = error as HttpError;

    if (err.message === 'Director not found') {
      err.status = 404;
    }

    next(err);
  }
};