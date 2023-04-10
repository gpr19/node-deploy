require('../models/musicas')

const mongoose = require('mongoose')
const Musicas = mongoose.model('musica')

exports.getAll = (req, res) => {
    Musicas.find({}).then((musicas) =>{
        return res.json(musicas)
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: err._message
        })
    })
}

exports.getOne = (req, res) => {
    Musicas.findOne({url: req.params.url}).then((musica) => {
        return res.json(musica)
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: 'Nada encontrado'
        })
    })
}

exports.createOne = (req, res) => {
    const data = req.body

    console.log(data)
    
    Musicas.create({
        nome: data.nome,
        url: data.url,
        videourl: data.videourl,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        letra: data.letra,
        cifra: data.cifra,
    }).then(() => {
        res.status(200).json({
            error: false,
            message: 'Cadastrado com sucesso'
        })
    }).catch((err) =>{
        // console.log(err)
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

    Musicas.updateOne({url: req.params.url}, {
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
    Musicas.deleteOne({url: req.params.url}).then((result) => {
        res.status(200).json({
            error: false,
            message: 'Deletado com sucesso, total linhas deletadas: ' + result.deletedCount
        })
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: 'Não foi deletado'
        })
    })
}