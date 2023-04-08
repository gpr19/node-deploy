require ('custom-env').env('staging')
require('./models/users')

const express = require('express')
const mongoose = require('mongoose')
const upLoadMissa = require('./middlewares/uploadimage')
const path = require('path')

const User = mongoose.model('user')
const app = express()

app.use(express.json())

/// CONECATAR NO BANCO DE DADOS
mongoose.connect(process.env.DB_PASS, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('conecatadoo')
}).catch((err) => {
    console.log(err)
})

/// HOME
app.get('/', (req, res) => {
    return res.json({titulo: 'criar API'})
})

/// UPLOAD DE IMAGEM DA MISSA
app.post('/upload-image', upLoadMissa.single('image'), async (req, res) => {

    if (req.file){
        return res.json({
            error: false,
            message: "Upload realizado com sucesso"
        })
    }

    return res.status(400).json({
        error: true,
        message: "Erro: Upload não foi realizado"
    })
    
})

// console.log(path.resolve(__dirname, "../public", "upload"))

/// PEGAR IMAGEMS
app.use('/files', express.static(path.resolve(__dirname, "../public", "upload")))

/// LISTAR UNICO USUARIO
app.get('/user/:username', (req, res) => {
    User.findOne({username: req.params.username}).then((user) => {
        return res.json(user)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: 'Nenhum usuario encontrado'
        })
    })
})

/// LISTAR TODOS USUARIOS
app.get('/user', (req, res) => {
    User.find({}).then((user) =>{
        return res.json(user)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: err._message
        })
    })
})

/// CRIAR USUARIO
app.post('/user', (req, res) => {
    User.create(req.body).then((result) => {
        res.status(200).json({
            error: false,
            message: 'Cadastrado com sucesso'
        })
    }).catch((err) =>{
        res.status(400).json({
            error: true,
            message: err._message
        })
    })
})

app.listen(3333, () => {
    console.log('Servidor iniciado: http://localhost:3333')
})