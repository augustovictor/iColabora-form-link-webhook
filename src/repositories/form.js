const Form = require('../models/form');
const FormResponse = require('../models/form-response');

exports.getForm = _id => {
    return Form.findOne({ _id });
}

exports.newForm = form => {
    return new Form(form).save();
};

exports.newFormResponse = (formId, userEmail, fields) => {
    return new FormResponse({formId, userEmail, fields}).save();
}