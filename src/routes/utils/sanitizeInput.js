const sanitize = require('mongo-sanitize');

const sanitizeInput = (req, _res, next) => {
    req.body = sanitize(req.body);
    next();
}

module.exports = sanitizeInput;
