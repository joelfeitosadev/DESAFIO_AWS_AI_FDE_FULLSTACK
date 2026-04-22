import { Router } from 'express';
import { create,getAllByParams } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie, create);
router.get('/', getAllByParams);

export default router;