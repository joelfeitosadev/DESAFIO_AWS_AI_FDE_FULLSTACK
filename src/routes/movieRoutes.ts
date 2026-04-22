import { Router } from 'express';
import { create } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie, create);

export default router;