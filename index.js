// MODULES
const server = require('http').createServer();
const r = require('./src/routes/v1');

// DEFINITIONS

// ROUTES
server.on('request', (req, res) => {
    switch(req.url) {
        case r.SAMPLE: r.sample(req, res); break;
        default      : r.notFound(req, res); break;
    }
});

// SERVER
server.listen(3000, () => {
    console.log('Running on port 3000');
});