const jwt = require('jsonwebtoken');

exports.sendEmail = data => {
    const processId = data['source-process-instance-id'];
    const { protocolKey, userEmail, solutionKey, formKey, filesToAppend } = data.formData;
    return jwt.sign({ processId, protocolKey, userEmail, solutionKey, formKey, filesToAppend }, 'CHANGE-THIS-SECRET').toString();
};