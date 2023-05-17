const mongoose = require('mongoose');

const Repertorio = new mongoose.Schema({
    missa: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    musicas: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        required: true,
    },
});

mongoose.model('repertorio', Repertorio);
