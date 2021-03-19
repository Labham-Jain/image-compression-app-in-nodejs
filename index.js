const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const imageCompression = require('./image-compress');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use(express.static('public'));
app.use('/images', express.static('images/compressed'));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images/temp/');
    },
    filename: (req, file, callback) => {
        callback(null, `${uuid.v4()}.${file.originalname}`)
    }
})
const uploadMiddleware = multer({
    storage
})
app.post('/compress', uploadMiddleware.single('image'), async (req, res) => {
    const originalImagePath = path.join(__dirname, req.file.path);
    const imagePath = req.file.path.split(path.sep).join('/')
    const image = await imageCompression(imagePath);

    const imageInfo = { originalSize: undefined, compressedSize: undefined, name: undefined, url: undefined };
    const splittedSrc = image.split(path.sep);
    const filename = splittedSrc[splittedSrc.length - 1];
    const compressedStat = fs.statSync(image);
    const originalStat = fs.statSync(originalImagePath);

    imageInfo.compressedSize = compressedStat.size;
    imageInfo.originalSize = originalStat.size;
    imageInfo.name = filename;
    imageInfo.url = 'http://localhost:8080/images/' + filename;

    res.json(imageInfo);
    fs.unlink(originalImagePath, (error) => { })
})

app.listen(8080, () => console.log(`server started on port 8080`));