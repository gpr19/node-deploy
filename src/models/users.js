const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        default: 'guest',
    },
});

mongoose.model('user', User);
