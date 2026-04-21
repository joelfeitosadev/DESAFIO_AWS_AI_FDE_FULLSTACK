import { Router } from 'express';
import { create } from '../controllers/directorController.js';
import { validateDirector } from '../middlewares/directorValidation.js';

const router = Router();

router.post('/', validateDirector, create);

export default router;