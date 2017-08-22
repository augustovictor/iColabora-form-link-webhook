const { getFiles } = require('../helpers');
const formRepository = require('../repositories/form');
const _ = require('lodash');

const turbinaHtml = `
<div><h3>Form vindo do turbina</h3><div><label id='contactQualification'>Qualificação atendimento</label><input id='contactQualification' type='text' name='contactQualification' /></div></div>
`;

exports.root = (req, res) => {
    res.end();
};

exports.getForm = (req, res) => {
    formRepository.getForm(req.params.id)
        .then(form => {
            return getFiles(form.localHtml)
                .then(files => {
                    return {
                        title: form.title,
                        turbinaHtml: turbinaHtml,
                        localHtml: files.map(file => file.toString()) // We need to convert each file as they return as buffers
                    };
                });
        })
        .then(params => {
            res.render('template', { params });
        })
        .catch(err => {
            res.send(err);
        });
};

exports.newForm =  (req, res) => {
    console.log('Received!');
    const form = _.pick(req.body, ['title', 'turbinaHtml', 'localHtml']);
    formRepository.newForm(form)
        .then(form => {
            res.send(form);
        })
        .catch(err => {
            res.send(err);
        });
};

exports.submitForm = (req, res) => {
    console.log(req.body);
    res.end();
}