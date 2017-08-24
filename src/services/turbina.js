const cache       = require('memory-cache');
const rp          = require('request-promise').defaults({ jar: true, resolveWithFullResponse: true });
const FIFTEEN_MIN = 900000;

exports.turbinaAuth = () => {
    console.log('Auth');
    const url = 'https://itaudev.icolabora.com.br/api/auth/login';
    const form = { username: 'victor', password: '123' };

    return rp.post(url, { form })
        .then(res => { 
            return { Cookie: res.headers['set-cookie'] }
        })
        .then(cookie => cache.put('cookie', cookie, FIFTEEN_MIN))
        .then(headers => {
            rp.defaults({ headers });
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

exports.getTaskEventsByProcessId = processId => {
    const url = `https://itaudev.icolabora.com.br/api/processinstances/${processId}/events`;
    return rp(url).then(res => {
        try {
            return JSON.parse(res.body);
        } catch (err) {
            return Promise.reject(err);
        }
    });
};

exports.claimTask = taskId => {
    const url = `https://itaudev.icolabora.com.br/api/tasks/${taskId}/claim`;
    return rp.post(url);
};

exports.completeTask = (taskId, data = null) => {
    const options = {
        method: 'POST',
        uri: `https://itaudev.icolabora.com.br/api/tasks/${taskId}/complete`,
    };
    
    data ? Object.assign(options, { formData: data }) : null;
    return rp(options);
};

exports.claimAndCompleteTask = function (taskId, data = null) {
    return this.claimTask(taskId).then(() => this.completeTask(taskId, data));
}