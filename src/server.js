const express = require('express')
const mongoose = require('mongoose')

require ('custom-env').env('staging')

require('./models/users')

const User = mongoose.model('user')

const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://bielpr19:ALYd3AXi5DGgcd2b@cluster0.pydjipv.mongodb.net/folhetosdecanto', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('conecatadoo')
}).catch((err) => {
    console.log(err)
})

app.get('/', (req, res) => {
    return res.json({titulo: 'criar API'})
})

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


app.get('/user/:username', (req, res) => {
    
    console.log(req.params.username)
    // res.json(req.params.username)

    User.findOne({username: req.params.username}).then((user) => {
        return res.json(user)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: 'Nenhum usuario encontrado'
        })
    })
})


app.post('/user', (req, res) => {
    const user = User.create(req.body).then((result) => {
        console.log(result)
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