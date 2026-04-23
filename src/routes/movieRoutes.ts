import { Router } from 'express';
import { create, getAllByParams, getById, update, remove } from '../controllers/movieController.js';
import { validateMovie } from '../middlewares/movieValidation.js';

const router = Router();

router.post('/', validateMovie,
  /* #swagger.tags = ['Movies']
     #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/MovieInput' } } */
  create
);

router.get('/',
  /* #swagger.tags = ['Movies']
     #swagger.parameters['title'] = { in: 'query', type: 'string' }
     #swagger.parameters['genre'] = { in: 'query', type: 'string' }
     #swagger.parameters['releaseYear'] = { in: 'query', type: 'integer' } */
  getAllByParams
);

router.get('/:id',
  // #swagger.tags = ['Movies']
  getById
);

router.put('/:id', validateMovie,
  /* #swagger.tags = ['Movies']
     #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/MovieInput' } } */
  update
);

router.delete('/:id',
  // #swagger.tags = ['Movies']
  remove
);

export default router;