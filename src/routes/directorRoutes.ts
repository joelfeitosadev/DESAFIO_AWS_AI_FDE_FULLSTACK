import { Router } from 'express';
import { create, getAll } from '../controllers/directorController.js';
import { validateDirector,  } from '../middlewares/directorValidation.js';

const router = Router();

router.post('/', validateDirector, create);
router.get('/', getAll);

export default router;