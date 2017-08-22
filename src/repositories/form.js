const Form = require('../models/form');

exports.getForm = _id => {
    return Form.findOne({ _id });
}

exports.newForm = form => {
    return new Form(form).save();
};