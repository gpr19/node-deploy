require('../models/repertorio');

const mongoose = require('mongoose');
const Repertorio = mongoose.model('repertorio');

exports.getAll = (req, res) => {
    Repertorio.find({ username: req.params.id })
        .sort({ data: 1 })
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

exports.getUnique = (req, res) => {
    Repertorio.find({ _id: req.params.id })
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
    const checkIsDataOrIsId = req.params.id.search('-') != -1 ? true : false;
    const query = checkIsDataOrIsId ? { data: req.params.id } : { _id: req.params.id };

    Repertorio.findOne({ ...query, username: req.params.username })
        .then((missa) => {
            if (!missa) {
                return res.status(200).json({
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

    Repertorio.create({
        missa: data.name,
        data: data.date,
        musicas: data.musics,
        username: data.username,
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

    Repertorio.findOne({ _id: data.id })
        .then((missa) => {
            if (!missa) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            Repertorio.updateOne(
                { _id: data.id },
                {
                    missa: data.name,
                    musicas: data.musics,
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
    Repertorio.findOne({ _id: req.params.id })
        .then((missa) => {
            if (!missa) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            Repertorio.deleteOne({ _id: missa._id })
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
