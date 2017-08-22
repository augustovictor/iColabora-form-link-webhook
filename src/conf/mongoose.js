const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/icolabora-form-mailer';

mongoose.connect(MONGODB_URI, { useMongoClient: true })
.then(db => {
    console.log('Successfully connected to database');

    process.on('SIGINT', () => {
        console.log('GRACEFUL SHUTDOWN! :)');
        db.close();
        process.exit();
    })
})
.catch(err => {
    console.log(MONGODB_URI);
    console.log(err);
});

module.exports = mongoose.connection;