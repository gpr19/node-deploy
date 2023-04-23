require('dotenv').config();

const missaController = require('./controllers/missas.controller');
const userController = require('./controllers/users.controller');
const musicaController = require('./controllers/musicas.controller');
const upLoadMissa = require('./middlewares/uploadimage');
const cors = require('cors');

const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    app.use(cors());
    next();
});

/// CONECATAR NO BANCO DE DADOS
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('conecatadoo');
    })
    .catch((err) => {
        console.log('Error: ' + err);
    });

const missaRouter = express.Router();
const userRouter = express.Router();
const musicaRouter = express.Router();

/// HOME
app.get('/', (req, res) => {
    console.log(process.env.MONGO_URL);
    return res.json({ titulo: 'API folhetos de canto' });
});

//#region MISSA
missaRouter
    .route('/missa')
    .get(missaController.getNext)
    .post(upLoadMissa.any('image'), missaController.createOne);

missaRouter.route('/missa/all').get(missaController.getAll);

missaRouter
    .route('/missa/:id')
    .get(missaController.getOne)
    .put(upLoadMissa.any('image'), missaController.updateOne)
    .delete(missaController.deleteOne);
//#endregion

//#region USER
userRouter.route('/user').get(userController.getAll).post(userController.createOne);

userRouter
    .route('/user/:username')
    .get(userController.getOne)
    .put(userController.updateOne)
    .delete(userController.deleteOne);

userRouter.route('/user/auth/login').post(userController.login);
//#endregion

//#region MUSICA
musicaRouter.route('/musica').get(musicaController.getAll).post(musicaController.createOne);

musicaRouter.route('/musica/:id').get(musicaController.getOne).put(musicaController.updateOne);

musicaRouter.route('/musica/:type/:subtype').get(musicaController.getTypes);
//#endregion

const path = require('path');

app.use(missaRouter);
app.use(userRouter);
app.use(musicaRouter);
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'upload')));

app.listen(3333, () => {
    console.log('Servidor iniciado: http://localhost:3333');
});
