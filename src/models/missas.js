const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

const Missa = new mongoose.Schema({
    missa: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        default: '',
    },
    data: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    imagem: {
        type: String,
        default: '',
    },
    musicas: {
        type: String,
        default: '',
    },
});

Missa.pre('deleteOne', function () {
    if (process.env.STORAGE_TYPE === 's3') {
        console.log('toaqui', this.getQuery().imagem);
        return s3
            .deleteObject({
                Bucket: 'folhetosdecanto',
                Key: this.getQuery().imagem,
            })
            .promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'upload', this.getQuery().imagem));
    }
});

mongoose.model('missa', Missa);
