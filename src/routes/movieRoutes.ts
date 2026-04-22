import { Router } from 'express';
import { create,getAllByParams, getById, update,remove } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie, create);
router.get('/', getAllByParams);
router.get('/:id', getById);
router.put('/:id', validateMovie,update);
router.delete('/:id', remove);

export default router;