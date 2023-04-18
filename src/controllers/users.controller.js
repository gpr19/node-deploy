require('../models/users');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const User = mongoose.model('user');

exports.getAll = (req, res) => {
    User.find({})
        .then((users) => {
            return res.json(users);
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error: ' + err,
            });
        });
};

exports.getOne = (req, res) => {
    User.findOne({ username: req.params.username })
        .then((user) => {
            if (!user) {
                return res.status(200).json({
                    error: true,
                    message: 'Nenhum usuario encontrado',
                });
            }
            return res.json(user);
        })
        .catch((err) => {
            return res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(200).json({
            error: true,
            message: 'Usuário ou senha não enviados',
        });
    }

    User.findOne({ username: username }).then((user) => {
        if (!user) {
            return res.status(200).json({
                error: true,
                message: 'Usuário ou senha inválidos',
            });
        } else {
            bcrypt.compare(password, user.senha, function (err, result) {
                if (result) {
                    return res.json({
                        error: false,
                        message: 'Login efetuado com sucesso',
                        data: {
                            nome: user.nome,
                            username: username,
                            level: user.level,
                        },
                    });
                } else {
                    return res.status(200).json({
                        error: true,
                        message: 'Usuário ou senha inválidos',
                    });
                }
            });
        }
    });
};

exports.createOne = async (req, res) => {
    const hash = await bcrypt.hash(req.body.senha, 10);
    req.body.senha = hash;

    User.create(req.body)
        .then(() => {
            res.status(200).json({
                error: false,
                message: 'Novo usuario cadastrado com sucesso',
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};

exports.updateOne = (req, res) => {
    User.updateOne({ username: req.params.username }, req.body)
        .then(() => {
            res.status(200).json({
                error: false,
                message: 'Atualizado com sucesso',
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
    User.deleteOne({ username: req.params.username })
        .then((result) => {
            res.status(200).json({
                error: false,
                message: 'Usuario deletado com sucesso, total linhas deletadas: ' + result.deletedCount,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                message: 'Error: ' + err.message,
            });
        });
};
