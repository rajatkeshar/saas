'use strict';
var jws = require('jws');
var algo = 'HS256';
const Promise=require("bluebird")

module.exports = {
    jwtsign : function(payload, secretOrPrivateKey, options){
		options = options || {};
		var header = {
			typ: 'JWT',
			alg: options.algorithm || algo
		};
		payload.iat = Math.round(Date.now() / 1000);
		if (options.expiresInMinutes) {
			var ms = options.expiresInMinutes * 60;
			payload.exp = payload.iat + ms;
		}

		if (options.issuer)
			payload.iss = options.issuer;

		if (options.subject)
			payload.sub = options.subject;

		var signed = jws.sign({
		    header: header,
		    payload: payload,
		    secret: secretOrPrivateKey
		});
		return Promise.resolve(signed) ;
	},
	jwtdecode : function(payload, options){
		options = options || {};		
		var signed = jws.decode(payload);
		return Promise.resolve(signed);
    }
}