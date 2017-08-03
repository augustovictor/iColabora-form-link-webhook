const fs = require('fs');
const path = require('path');

module.exports.pathToFile = (fileName) => {
    const p = path.resolve(__dirname, '../public');
    return `${ p }/${ fileName }.html`;
};

module.exports.getFile = (fileName) => {
    return fs.readFileSync(this.pathToFile(fileName));
};