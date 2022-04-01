const _           = require('lodash');
const Promise     = require('bluebird');
const Op          = require('sequelize').Op;
const dbModels    = appGlobals.dbModels;
const modelName   = "users";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class UsersService extends BaseService {

    async getUsers(req) {
        try {
            let offset = parseInt(req.query.offset) || 0;
            let limit = parseInt(req.query.limit) || 10;
            if(req.authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let users = await dbModel.findAll({ offset: offset, limit: limit, where: { active: true }, attributes: ['user_id', 'display_name', 'first_name', 'last_name', 'profile_pic_url', 'company_name', 'company_site', 'email_id', 'user_role', 'booster'] });
            users = JSON.parse(JSON.stringify(users));
            return Promise.resolve({success: true, message: "users info", data: users});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getUserInfo(req) {
        try {
            if(req.authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { user_id: req.params.id } });
            user = JSON.parse(JSON.stringify(user));
            delete user.password;
            return Promise.resolve({success: true, message: "user info", data: user});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new UsersService();
    }
};