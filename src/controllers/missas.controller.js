require('../models/missas');

const mongoose = require('mongoose');
const Missa = mongoose.model('missa');

exports.getAll = (req, res) => {
    Missa.find({})
        .then((missa) => {
            return res.json(missa);
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error: ' + err,
            });
        });
};

exports.getOne = (req, res) => {
    Missa.findOne({ url: req.params.id })
        .then((missa) => {
            if (!missa) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            return res.json(missa);
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error: ' + err,
            });
        });
};

exports.createOne = async (req, res) => {
    const data = req.body;

    const checkUnique = await Missa.find({ url: data.url });

    if (checkUnique.length != 0)
        return res.send({
            error: true,
            message: 'Já existe uma musica com este link',
        });

    let file = '';
    if (req.files) {
        file = req.files[0].key;
    }

    Missa.create({
        missa: data.name,
        data: data.date,
        url: data.url,
        descricao: data.description,
        musicas: data.musics,
        imagem: file,
    })
        .then(() => {
            res.status(200).json({
                error: false,
                message: 'Cadastrado com sucesso',
            });
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error: ' + err,
            });
        });
};

exports.updateOne = (req, res) => {
    const data = req.body;

    Missa.findOne({ url: data.currentMissa })
        .then((missa) => {
            if (!missa) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            let file = missa.imagem;
            if (req.file) {
                file = req.files[0].key;
            }

            Missa.updateOne(
                { url: data.currentMissa },
                {
                    missa: data.name,
                    data: data.date,
                    url: data.url,
                    descricao: data.description,
                    musicas: data.musics,
                    imagem: file,
                }
            )
                .then(() => {
                    res.status(200).json({
                        error: false,
                        message: 'Atualizado com sucesso, voltando a pagina em 2 segundos',
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        error: true,
                        message: err.message,
                    });
                });
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error1: ' + err,
            });
        });
};

exports.deleteOne = (req, res) => {
    Missa.findOne({ url: req.params.id })
        .then((missa) => {
            if (!missa) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            Missa.deleteOne({ imagem: missa.imagem })
                .then((result) => {
                    res.status(200).json({
                        error: false,
                        message:
                            'Deletado com sucesso, total linhas deletadas: ' + result.deletedCount,
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        error: true,
                        message: 'Não foi deletado ' + err,
                    });
                });
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Nada encontrado ' + err,
            });
        });
};
