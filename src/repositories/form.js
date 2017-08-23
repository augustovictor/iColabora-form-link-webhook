const FormResponse = require('../models/form-response');

exports.newFormResponse = (formId, userEmail, fields) => {
    return new FormResponse({formId, userEmail, fields}).save();
};