const { getFile } = require('../../helpers');

// ROUTES - NAMES
const SAMPLE = '/sample';

// ROUTES - RESPONSE
const sample = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(getFile(req.url));
};

const notFound = (req, res) => {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(getFile('404'));
};

module.exports = {
    SAMPLE,
    sample,
    notFound
};