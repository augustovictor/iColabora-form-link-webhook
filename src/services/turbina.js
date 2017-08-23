const cache = require('memory-cache');
const rp = require('request-promise').defaults({ jar: true, resolveWithFullResponse: true });

exports.turbinaAuth = () => {
    const options = {
        method: 'POST',
        uri: 'https://itaudev.icolabora.com.br/api/auth/login',
        form: {
            username: 'victor',
            password: '123'
        }
    };
    
    return rp(options).then(res => ({ Cookie: res.headers['set-cookie'] }))
        .then(cookie => cache.put('cookie', cookie, 15000))
        .then(res => {
            rp.defaults({ headers: { Cookie: cache.get('cookie') } });
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

exports.getLastDeploymentId = solutionKey => { // dynamic_mail_api
    const url = `https://itaudev.icolabora.com.br/api/solutions/${solutionKey}/lastdeploymentbykey`;
    return rp(url).then(res => {
        try {
            return JSON.parse(res.body).deploymentId;
        } catch(err) {
            return Promise.reject(err);
        }
    });
};

exports.getHtmlForm = (deploymentId, formKey) => { // c82ac0c119ee4514bc1dd4f0255226d2 form_client_satisfaction
    const url = `https://itaudev.icolabora.com.br/api/deployments/${deploymentId}/resources/${formKey}.html`;
    return rp(url);
};

exports.getFormByDeployment = function(solutionKey, formKey) {
    return this.getLastDeploymentId(solutionKey)
        .then(deploymentId => this.getHtmlForm(deploymentId, formKey))
        .then(res => res.body);
};
