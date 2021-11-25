const router = require('express').Router();
const imgModel = require('../models/3dmodel');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var filetypes = /glb/;
        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());
            if (extname) {
                return cb(null, true);
            }
            return cb(JSON.stringify({ "success": false, "message": "invalid file type" }), false);
    },
    limits: { fileSize: 250 * 1024 * 1024 },
});

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/', upload.single('model'), (req, res, next) => {
    // dont add data to db if file type is not .glb
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        creator: req.body.creator,
    }
    imgModel.create(obj, (err, item) => {
        res.redirect('/');
    });
});

module.exports = router;