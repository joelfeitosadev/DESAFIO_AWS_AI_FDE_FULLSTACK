import { Router } from 'express';
import { create,getAllByParams, getById, update } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie, create);
router.get('/', getAllByParams);
router.get('/:id', getById);
router.put('/:id', update)

export default router;