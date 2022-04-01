const jwt = require('jsonwebtoken');
const NOAUTH_PATH = config.get('auth').NOAUTH_APIS;

module.exports = function() {
    return function(req, res, next) {
        let token_header, token_parts, decoded;
        if(NOAUTH_PATH.includes(req.path) || req.path.includes('public')) { return next();}

        try {
            token_header = req.headers.Authorization || req.headers.authorization;
            token_parts = token_header.split(' ');
            decoded = jwt.verify(token_parts[token_parts.length -1], process.env.JWT_SECRET || 'k94e7173-b81b-29e9-badc-915212e3b5e7');
        } catch (e) {
            console.log('Authentication failed for headers', req.headers);
            return res.sendStatus(401);
        }

        req.authInfo = decoded;
        return next();
    };
};
