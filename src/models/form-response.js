const mongoose = require('mongoose');
const Guid     = require('guid');

mongoose.set('debug', true);

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
        type: String,
        required: true,
        ref: 'Form'
    },
    fields: Object
}, {
    timestamps: true,
    autoIndex: false
});

FormResponseSchema.index({
    userEmail: 1,
    formId: 1
}, {
    unique: true
});

FormResponseSchema.post('save', function(err, doc, next) {
    if(err.name === 'MongoError' && err.code === 11000) {
        next(new Error('This form has already been submited'));
    } else {
        next(err);
    }
});


const FormResponse = mongoose.model('FormResponse', FormResponseSchema);

FormResponse.ensureIndexes(err => {
    if(err) {
        console.log(err);
    }
});

module.exports = FormResponse;