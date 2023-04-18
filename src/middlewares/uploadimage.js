require('dotenv').config();

const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'upload'));
        },
        filename: (req, file, cb) => {
            file.key = 'img_' + req.body.url;
            cb(null, file.key);
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'folhetosdecanto',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, 'img_' + req.body.url);
        },
    }),
};

module.exports = multer({
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'upload'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    fileFilter: (req, file, cb) => {
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(
            (formatoAceito) => formatoAceito == file.mimetype
        );
        if (extensaoImg) {
            return cb(null, true);
        }
        return cb(null, false);
    },
});
