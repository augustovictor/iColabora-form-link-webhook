const express    = require('express');
const bodyParser = require('body-parser');

const routesV1   = require('./routes/v1');

// DEFINITIONS
const app = express();

// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use('/api/v1', routesV1);

module.exports = app;