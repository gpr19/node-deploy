require('../models/musicas');

const mongoose = require('mongoose');
const Musicas = mongoose.model('musica');

exports.getAll = (req, res) => {
    Musicas.find({})
        .sort({ nome: 1 })
        .then((musicas) => {
            return res.json(musicas);
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: err._message,
            });
        });
};

exports.getTypes = (req, res) => {
    Musicas.find({ categoria: req.params.type })
        .then((musica) => {
            if (req.params.subtype === 'todas') return res.json(musica);
            let array = [];
            for (let index = 0; index < musica.length; index++) {
                const element = musica[index];
                if (element.subcategoria.search(req.params.subtype) != -1) {
                    array.push(element);
                }
            }
            return res.json(array);
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};

exports.getOne = (req, res) => {
    Musicas.findOne({ url: req.params.id })
        .then((musica) => {
            return res.json(musica);
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Nada encontrado',
            });
        });
};

exports.createOne = async (req, res) => {
    const data = req.body;

    const checkUnique = await Musicas.find({ url: data.url });

    if (checkUnique.length != 0)
        return res.send({
            error: true,
            message: 'Já existe uma musica com este link',
        });

    // return
    Musicas.create({
        nome: data.name,
        url: data.url,
        videourl: data.video,
        categoria: data.category,
        subcategoria: JSON.stringify(data.subcategory),
        letra: data.htmlLyrics,
        cifra: data.htmlChord,
    })
        .then(() => {
            res.status(200).json({
                error: false,
                message: 'Cadastrado com sucesso',
            });
        })
        .catch((err) => {
            // console.log(err)
            res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};

exports.updateOne = (req, res) => {
    const data = req.body;

    Musicas.findOne({ url: data.currentMusic })
        .then((musica) => {
            if (!musica) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            Musicas.updateOne(
                { url: data.currentMusic },
                {
                    nome: data.name,
                    url: data.url,
                    videourl: data.video,
                    categoria: data.category,
                    subcategoria: JSON.stringify(data.subcategory),
                    letra: data.htmlLyrics,
                    cifra: data.htmlChord,
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
                        message: 'Error: ' + err._message,
                    });
                });
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};

exports.deleteOne = (req, res) => {
    Musicas.findOne({ url: req.params.id })
        .then((musica) => {
            if (!musica) {
                return res.status(400).json({
                    error: true,
                    message: 'Nada encontrado',
                });
            }
            Musicas.deleteOne({ _id: musica._id })
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
                        message: 'Não foi deletado' + err,
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
