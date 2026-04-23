import { Router } from 'express';
import { create, getAll, getById, getMovies, update, remove } from '../controllers/directorController.js';
import { validateDirector } from '../middlewares/directorValidation.js';

const router = Router();

router.post('/', validateDirector,
  /* #swagger.tags = ['Directors']
     #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/DirectorInput' } } */
  create
);

router.get('/',
  // #swagger.tags = ['Directors']
  getAll
);

router.get('/:id',
  // #swagger.tags = ['Directors']
  getById
);

router.get('/:id/movies',
  // #swagger.tags = ['Directors']
  getMovies
);

router.put('/:id', validateDirector,
  /* #swagger.tags = ['Directors']
     #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/DirectorInput' } } */
  update
);

router.delete('/:id',
  // #swagger.tags = ['Directors']
  remove
);

export default router;