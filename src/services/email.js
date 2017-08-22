const jwt = require('jsonwebtoken');

exports.sendEmail = (formId, userEmail) => {
    return jwt.sign({formId, userEmail}, 'CHANGE-THIS-SECRET').toString();
};