const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    htmlFromTurbina: {
        type: String
    }
}, {
    timestamps: true
});

