const _ = require('lodash');

const { getFiles, decodeToken } = require('../helpers');
const formRepository = require('../repositories/form');
const emailService = require('../services/email');
const turbinaService = require('../services/turbina');

// <div><h3>Form vindo do turbina</h3><div><label id='contactQualification'>Qualificação atendimento</label><input id='contactQualification' type='text' name='contactQualification' /></div></div>
// https://itaudev.icolabora.com.br/api/deployments/133a17a8eb3a42e1b8784325a4134a7d/resources/form_client_satisfaction.html

exports.root = (req, res) => {
    res.end();
};

exports.getForm = (req, res) => {
    const decodedToken = decodeToken(req.params.token);

    if (decodedToken.err) {
        return res.send(err);
    };

    turbinaService.getFormByDeployment(decodedToken.solutionKey, decodedToken.formKey)
        .then(turbinaHtml => getFiles([decodedToken.filesToAppend])
            .then(files => {
                return {
                    turbinaHtml,
                    localHtml: files.map(file => file.toString()) // We need to convert each file as they return as buffers
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
    // {
    //     'source-process-instance-id': '265c18e23b2244898219de39b7daf89d',
    //     formData: '{user-email=victoraweb@gmail.com, solution-key=dynamic_mail_api, form-key=form_client_satisfaction, protocol-key=12345, files-to-append=aa-aa, b-b}'
    // }

    let response = req.body;

    response.formData = response.formData.replace(/[{} ]/g, '').split(',').reduce((acc, curr) => {
        const pair = curr.split('=');
        acc[pair[0]] = pair[1]
        return acc;
    }, {});

    // console.log(response);

    res.send(emailService.sendEmail(response));

    /*
    {
        'source-process-instance-id': '1eea0745c1f94e1ea1e3e2e4a5fdb0b5',
        formData: {
            formKey: 'form_client_satisfaction',
            ' filesToAppend': 'aa-aa',
            ' userEmail': 'victoraweb@gmail.com',
            ' solutionKey': 'dynamic_mail_api',
            ' protocolKey': '123456'
        }
    }
    */

};

exports.submitForm = (req, res) => {
    const splitReferer = req.headers.referer.split('/');
    const token = splitReferer[splitReferer.length - 1];
    const decodedToken = getFormIdAndUserEmailFromToken(token);

    if (decodedToken.err) {
        return res.send(err);
    };
    const {
        formId,
        userEmail
    } = decodedToken;

    formRepository.newFormResponse(formId, userEmail, req.body)
        .then(formResponse => {
            res.send(formResponse);
        })
        .catch(err => {
            res.status(410).send({
                error: err.message
            });
        });
};
