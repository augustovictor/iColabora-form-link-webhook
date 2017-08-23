const { turbinaAuth } = require('../../services/turbina');
const cache = require('memory-cache');
const rp = require('request-promise');

exports.auth = (req, res, next) => {
    if(!cache.get('cookie')) {
        turbinaAuth()
            .then(cookie => cache.put('cookie', cookie, 15000))
            .then(res => {
                rp.defaults({ headers: { Cookie: cache.get('cookie') } });
                next();
            })
            .catch(err => {
                res.status(401).send('Not authorized');
            });
    } else {
        next();
    }
};