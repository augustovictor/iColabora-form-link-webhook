// MODULES
const express = require('express');
const bodyParser = require('body-parser');
const routesV1 = require('./routes/v1');

require('./conf/mongoose');

// DEFINITIONS
const port = process.env.PORT || 3000;
const app = require('./app');
app.use('/api/v1', routesV1);
// SERVER
app.listen(port, () => {
    console.log(`Running on port ${port}. Environment: ${process.env.NODE_ENV}`);
});