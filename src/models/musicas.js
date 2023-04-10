const mongoose = require('mongoose')

const Musica = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    videourl: {
        type: String,
        default: ""
    },
    categoria: {
        type: String,
        default: ""
    },
    subcategoria: {
        type: String,
        default: ""
    },
    letra: {
        type: String,
        default: ""
    },
    cifra: {
        type: String,
        default: ""
    }

})

mongoose.model('musica', Musica)