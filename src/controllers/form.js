const _ = require('lodash');

const { getFiles, getFormIdAndUserEmailFromToken }   = require('../helpers');
const formRepository = require('../repositories/form');
const emailService   = require('../services/email');
const turbinaService   = require('../services/turbina');

// <div><h3>Form vindo do turbina</h3><div><label id='contactQualification'>Qualificação atendimento</label><input id='contactQualification' type='text' name='contactQualification' /></div></div>
// https://itaudev.icolabora.com.br/api/deployments/133a17a8eb3a42e1b8784325a4134a7d/resources/form_client_satisfaction.html

exports.root = (req, res) => {
    res.end();
};

exports.getForm = (req, res) => {
    const decodedToken = getFormIdAndUserEmailFromToken(req.params.token);

    if(decodedToken.err) {
        return res.send(err);
    };

    formRepository.getForm(decodedToken.formId)
        .then(form => getFiles(form.localHtml)
            .then(files => ({
                title: form.title,
                turbinaHtml: form.turbinaHtml,
                localHtml: files.map(file => file.toString()) // We need to convert each file as they return as buffers
            }))
        )
        .then(params => {
            res.render('template', { params });
        })
        .catch(err => {
            res.send(err);
        });
};

exports.newForm =  (req, res) => {
    const form = _.pick(req.body, ['title', 'turbinaHtml', 'localHtml']);
    formRepository.newForm(form)
        .then(form => {
            res.send(form);
        })
        .catch(err => {
            res.send(err);
        });
};

exports.sendEmail = (req, res) => {
    const { formId, userEmail } = req.body
    res.send(emailService.sendEmail(formId, userEmail));
};

exports.submitForm = (req, res) => {
    const splitReferer = req.headers.referer.split('/');
    const token = splitReferer[splitReferer.length -1];
    const decodedToken = getFormIdAndUserEmailFromToken(token);
    
    if(decodedToken.err) {
        return res.send(err);
    };
    const { formId, userEmail } = decodedToken;

    formRepository.newFormResponse(formId, userEmail, req.body)
        .then(formResponse => {
            res.send(formResponse);
        })
        .catch(err => {
            res.status(410).send({error: err.message});
        });
};

exports.getTurbinaForm = (req, res, next) => {
    const { solutionKey, formKey } = req.body;
    turbinaService.getHtmlFormFromLastDeploymentId(solutionKey, formKey)
        .then(result => {
            res.send(result.body);
        })
        .catch(err => {
            next(err);
        });
};
