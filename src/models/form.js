const mongoose = require('mongoose');
const Guid     = require('guid');

const FormSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: Guid.raw
    },
    title: {
        type: String,
        required: true
    },
    turbinaHtml: {
        type: String
    },
    localHtml: [{
        type: String
    }]
}, {
    timestamps: true
});

FormSchema.pre('save', function(next) {
    const form = this;
    form.turbinaHtml = escape(form.turbinaHtml);
    next();
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;