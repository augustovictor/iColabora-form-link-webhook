const fs   = require('fs-extra-promise');
const path = require('path');

module.exports.pathToFile = (pathToFile) => {
    return path.join(process.env.PWD, 'views', pathToFile);
};

module.exports.getFile = (pathToFile) => {
    return fs.readFileAsync(this.pathToFile(pathToFile))
};