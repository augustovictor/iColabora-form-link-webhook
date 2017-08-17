const express = require('express');
const bodyParser = require('body-parser');

// DEFINITIONS
const app = express();

// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

module.exports = app;