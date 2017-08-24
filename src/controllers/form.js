const { getFiles, decodeToken, isProcessAvailable } = require('../helpers');
const emailService              = require('../services/email');
const turbinaService            = require('../services/turbina');

exports.root = (req, res) => {
    res.end();
};

exports.getForm = (req, res) => {

    const decodedToken = decodeToken(req.params.token);

    if (decodedToken.err) {
        return res.send(decodedToken.err);
    };

    turbinaService.getTaskEventsByProcessId(decodedToken.processId)
        .then(events => isProcessAvailable(events))
        .then(formAvailable => formAvailable ? Promise.resolve() : Promise.reject('Form no longer available'))
        .then(() => turbinaService.getFormByDeployment(decodedToken.solutionKey, decodedToken.formKey))
        .then(turbinaHtml => ({
            protocolKey: decodedToken.protocolKey,
            turbinaHtml
        }))
        .then(params => {
            res.render('template', { params });
        })
        .catch(err => {
            if(err.code === 'ENOENT') {
                const filePathSplit = err.path.split('/');
                const filename = filePathSplit[filePathSplit.length -1];
                err = `File does not exist: ${filename}`;
            }
            res.send(err);
        });
};

exports.sendEmail = (req, res) => {
    let response = req.body;

    response.formData = response.formData.replace(/[{} ]/g, '').split(',').reduce((acc, curr) => {
        const pair = curr.split('=');
        acc[pair[0]] = pair[1]
        return acc;
    }, {});

    res.send(emailService.sendEmail(response));
};

exports.submitForm = (req, res) => {
    const splitReferer = req.headers.referer.split('/');
    const token = splitReferer[splitReferer.length - 1];
    const decodedToken = decodeToken(token);

    if (decodedToken.err) {
        return res.send(decodedToken.err);
    };

    turbinaService.getTaskEventsByProcessId(decodedToken.processId)
        .then(events => {
            const taskId = events[events.length -1].taskId;
            return turbinaService.claimAndCompleteTask(taskId, req.body);
        })
        .then(response => {
            const params = {
                protocolKey: decodedToken.protocolKey
            };
            res.render('after-form', { params });
        })
        .catch(err => {
            res.send(err);
        });
};

// solutionKey: dynamic_mail_api
// formKey: form_client_satisfaction