const mongoose = require('mongoose');
const Guid     = require('guid');

const FormResponseSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: Guid.raw
    },
    userEmail: {
        type: String,
        required: true
    },
    formId: {
        type: String
    },
    fields: Object
}, {
    timestamps: true
});

const FormResponse = mongoose.model('FormResponse', FormResponseSchema);

module.exports = FormResponse;