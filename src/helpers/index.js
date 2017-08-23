const fs   = require('fs-extra-promise');
const path = require('path');
const jwt            = require('jsonwebtoken');

exports.pathToFile = (pathToFile) => {
    return path.join(process.env.PWD, 'views', pathToFile);
};

exports.getFiles = function (fileNamesArray) {
    return Promise.all(
        fileNamesArray.map(fileName => fs.readFileAsync(
            path.join(process.env.PWD, 'views', fileName))
        )
    );
};

exports.decodeToken = token => {
    try {
        return jwt.verify(token, 'CHANGE-THIS-SECRET');
    } catch(err) {
        return { err };
    }
};
