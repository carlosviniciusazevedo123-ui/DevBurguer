import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import productsController from './app/controllers/productsController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authMiddleware from './app/middleware/auth.js';
import CategoryController from './app/controllers/CategoryController.js';
import adminMiddleware from './app/middleware/admin.js'
import OrderController from './app/controllers/OrderController.js';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

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

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', adminMiddleware, OrderController.update);

routes.get('/categories', CategoryController.index);

export default routes;
