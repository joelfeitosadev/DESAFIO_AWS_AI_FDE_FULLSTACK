import { Router } from 'express';
import { create, getAll, getById, getMovies, update, remove } from '../controllers/directorController.js';
import { validateDirector } from '../middlewares/directorValidation.js';

const router = Router();

router.post('/', validateDirector, create);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/movies', getMovies);
router.put('/:id', validateDirector, update);
router.delete('/:id', remove);

export default router;