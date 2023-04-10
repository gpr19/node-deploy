require('../models/users')

const mongoose = require('mongoose')
const User = mongoose.model('user')

exports.getAll = (req, res) => {
    User.find({}).then((users) =>{
        return res.json(users)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: err._message
        })
    })
}

exports.getOne = (req, res) => {
    User.findOne({username: req.params.username}).then((user) => {
        if (!user){
            return res.status(400).json({
                error: true,
                message: 'Nenhum usuario encontrado'
            })
        }
        return res.json(user)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: 'Nenhum usuario encontrado'
        })
    })
}

exports.createOne = (req, res) => {
    User.create(req.body).then(() => {
        res.status(200).json({
            error: false,
            message: 'Novo usuario cadastrado com sucesso'
        })
    }).catch((err) =>{
        res.status(400).json({
            error: true,
            message: err._message
        })
    })
}

exports.updateOne = (req, res) => {
    const data = req.body
    let file = ""
    if (req.file){
        file = req.file.filename
    }

    User.updateOne({username: req.params.username}, req.body).then(() => {
        res.status(200).json({
            error: false,
            message: 'Atualizado com sucesso'
        })
    }).catch((err) =>{
        res.status(400).json({
            error: true,
            message: err._message
        })
    })
}

exports.deleteOne = (req, res) => {
    User.deleteOne({username: req.params.username}).then((result) => {
        res.status(200).json({
            error: false,
            message: 'Usuario deletado com sucesso, total linhas deletadas: ' + result.deletedCount
        })
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: 'Não foi deletado'
        })
    })
}