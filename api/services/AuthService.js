const Promise     = require('bluebird');
const appConfig   = config.get('app');
const jwtsecret   = appConfig.jwtsecret;
const jwtexpiry   = appConfig.jwtexpiry;
const utils       = require(global.appDir + '/utils/jwtutil');
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class AuthService extends BaseService {

    async login(user){
        try {
            let data = {
                email_id: user.email_id,
                user_id: user.user_id,
                user_name: user.user_name
            }
            var jwt = await utils.jwtsign(data, jwtsecret, { expiresInMinutes: jwtexpiry });
            return Promise.resolve({success: true, message: "login successful", data: user, token: jwt});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

};

module.exports = {
    getInst : function (){
        return new AuthService();
    }
};
