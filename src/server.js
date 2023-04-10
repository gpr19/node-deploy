require('dotenv').config()

const missaController = require('./controllers/missas.controller')
const userController = require('./controllers/users.controller')
const musicaController = require('./controllers/musicas.controller')
const upLoadMissa = require('./middlewares/uploadimage')

const mongoose = require('mongoose')
const express = require('express')
const app = express()
app.use(express.json())

/// CONECATAR NO BANCO DE DADOS
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('conecatadoo')
}).catch((err) => {
    console.log('Error: ' + err)
})

const missaRouter = express.Router();
const userRouter = express.Router();
const musicaRouter = express.Router();

//#region MISSA
missaRouter.route('/missa')
    .get(missaController.getAll)
    .post(upLoadMissa.single('image'), missaController.createOne)

missaRouter.route('/missa/:id')
    .get(missaController.getOne)
    .patch(upLoadMissa.single('image'), missaController.updateOne)
    .delete(missaController.deleteOne)
//#endregion    

//#region USER
userRouter.route('/user')
    .get(userController.getAll)
    .post(userController.createOne)

    userRouter.route('/user/:username')
    .get(userController.getOne)
    .patch(userController.updateOne)
    .delete(userController.deleteOne)
//#endregion

//#region MUSICA
musicaRouter.route('/musica')
    .get(musicaController.getAll)
    .post(musicaController.createOne)
//#endregion

const path = require('path')

app.use(missaRouter)
app.use(userRouter)
app.use(musicaRouter)
app.use('/files', express.static(path.resolve(__dirname, "..", "tmp", "upload")))

/// HOME
app.get('/', (req, res) => {
    console.log(process.env.MONGO_URL)
    return res.json({titulo: 'API folhetos de canto'})
})

app.listen(3333, () => {
    console.log('Servidor iniciado: http://localhost:3333')
})