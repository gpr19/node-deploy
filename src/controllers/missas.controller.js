require('../models/missas')

const mongoose = require('mongoose')
const Missa = mongoose.model('missa')

exports.getAll = (req, res) => {
    Missa.find({}).then((missa) =>{
        return res.json(missa)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: err._message
        })
    })
}

exports.getOne = (req, res) => {
    Missa.findOne({_id: req.params.id}).then((missa) => {
        return res.json(missa)
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: 'Nada encontrado'
        })
    })
}

exports.createOne = (req, res) => {
    const data = req.body
    let file = ""
    if (req.file){
        // console.log(req.file)
        file = req.file.key
    }

    Missa.create({
        missa: data.missa,
        data: data.data,
        url: data.url,
        descricao: data.descricao,
        musicas: data.musicas,
        imagem: file
    }).then(() => {
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
}

exports.updateOne = (req, res) => {
    const data = req.body
    let file = ""
    if (req.file){
        file = req.file.filename
    }

    Missa.updateOne({_id: req.params.id}, {
        missa: data.missa,
        data: data.data,
        url: data.url,
        descricao: data.descricao,
        musicas: data.musicas,
        imagem: file
    }).then(() => {
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
    Missa.findOne({_id: req.params.id}).then((missa) => {
        if (!missa){
            return res.status(400).json({
                error: true,
                message: 'Nada encontrado'
            })
        }
        Missa.deleteOne({imagem: missa.imagem}).then((result) => {
            res.status(200).json({
                error: false,
                message: 'Deletado com sucesso, total linhas deletadas: ' + result.deletedCount
            })
        }).catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Não foi deletado ' + err
            })
        })
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: 'Nada encontrado ' + err
        })
    })
}