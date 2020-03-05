import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationsController from './app/controllers/NotificationController';

import RecipientController from './app/controllers/RecipientControllers';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/deliveryman', DeliverymanController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:id', NotificationsController.update);

routes.get('/delivery', DeliveryController.index);

export default routes;
