const path = require('path');
const imagemin = require('imagemin');
const imageminJpegTran = require('imagemin-jpegtran');
const imageminPngQuant = require('imagemin-pngquant');
const config = require('./config.js');

const imageCompression = async (...imagePath) => {
    const files = await imagemin(imagePath, {
        destination: config.destinationFolder,
        plugins: [
            imageminJpegTran(),
            imageminPngQuant({
                quality: [0.6, 0.8]
            })
        ]
    });

    return path.join(__dirname, files[0].destinationPath)
}
module.exports = imageCompression;