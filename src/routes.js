import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const cors = require('cors');
const fileUpload = require('express-fileupload');
const multer = require('multer');

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './files');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: Storage,
}).array('slide', 20);

const routes = new Router();

routes.use(cors());

routes.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});


routes.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json(err);
    const { files } = req;
    return res.json({ files });
  });
});

routes.use(fileUpload({}));

routes.get('/', (req, res) => res.json({ mensagem: 'Painel de Análise' }));

// Criar Secção de Login
routes.get('/sessions', authMiddleware, SessionController.index);
routes.post('/sessions', SessionController.store);

// Rotas de Usuário
routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

export default routes;
