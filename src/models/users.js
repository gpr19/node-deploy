const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

mongoose.model('user', User)