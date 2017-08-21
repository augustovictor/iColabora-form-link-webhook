// MODULES
const express = require('express');
const bodyParser = require('body-parser');
require('./conf/mongoose');

// DEFINITIONS
const port = process.env.PORT || 3000;
const app = require('./app');

// SERVER
app.listen(port, () => {
    console.log(`Running on port ${port}. Environment: ${process.env.NODE_ENV}`);
});