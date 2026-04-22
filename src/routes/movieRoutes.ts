import { Router } from 'express';
import { create,getAllByParams, getById } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie, create);
router.get('/', getAllByParams);
router.get('/:id', getById)

export default router;