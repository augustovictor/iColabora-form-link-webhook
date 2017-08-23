const { turbinaAuth } = require('../../services/turbina');
const cache = require('memory-cache');

exports.auth = (req, res, next) => {
    if(!cache.get('cookie')) {
        turbinaAuth().then(() => next());
    } else {
        next();
    }
};
