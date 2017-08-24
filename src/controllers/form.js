const _                         = require('lodash');

const { getFiles, decodeToken } = require('../helpers');
const formRepository            = require('../repositories/form');
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
    // console.log(decodedToken);

    turbinaService.getFormByDeployment(decodedToken.solutionKey, decodedToken.formKey)
        .then(turbinaHtml => getFiles([decodedToken.filesToAppend])
            .then(files => {
                return {
                    protocolKey: decodedToken.protocolKey,
                    turbinaHtml,
                    localHtml: files && files.map(file => file.toString()) // We need to convert each file as they return as buffers
                };
            })
        )
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

    turbinaService.getTaskIdByProcessId(decodedToken.processId)
        .then(task => turbinaService.claimAndCompleteTask(task.taskId, req.body))
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