import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import productsController from './app/controllers/productsController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authMiddleware from './middleware/auth.js';
import CategoryController from './app/controllers/CategoryController.js';
import adminMiddleware from './middleware/admin.js';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.post(
  '/products',
  adminMiddleware,
  upload.single('file'),
  productsController.store,
);

routes.put(
  '/products/:id',
  adminMiddleware,
  upload.single('file'),
  productsController.update,
);

routes.get('/products', productsController.index);

routes.post(
  '/categories',
  adminMiddleware,
  upload.single('file'),
  CategoryController.store,
);
routes.put(
  '/categories/:id',
  adminMiddleware,
  upload.single('file'),
  CategoryController.update,
);
routes.get('/categories', CategoryController.index);

export default routes;
