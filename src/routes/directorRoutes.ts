import { Router } from 'express';
import { create, getAll, getById, update } from '../controllers/directorController.js';
import { validateDirector } from '../middlewares/directorValidation.js';

const router = Router();

router.post('/', validateDirector, create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validateDirector, update);

export default router;