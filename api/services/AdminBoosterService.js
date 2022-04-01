const crypto      = require('crypto');
const Promise     = require('bluebird');
const dbModels    = appGlobals.dbModels;
const modelName   = "boosters";
const utils       = require(global.appDir + '/utils');
const BaseService = require(global.appDir + '/api/services/BaseService.js');
const MailService = require(global.appDir + '/api/services/MailService.js');
const UserService = require(global.appDir + '/api/services/UserService.js');

class BoosterService extends BaseService {

    async createBooster(reqBody, authInfo){
        try {
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            reqBody.booster_uuid = utils.Booster();
            reqBody.booster_token = crypto.randomBytes(48).toString('hex');
            reqBody.booster_registration_number = new Date().valueOf();
            let dbModel = await dbModels.getModelInstance(modelName);
            let booster = await dbModel.create(reqBody);
            let dbModelUser = await dbModels.getModelInstance("users");
            await dbModelUser.update({booster: "active"}, { where: { user_id: reqBody.user_ref_id} });
            const subject = "Congratulations for Booster";
            const html = "Hi, " + "\n Your Are Approved As Booster";
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(email_id, subject, text, html);
            return Promise.resolve({success: true, message: "booster created", data: booster});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getBoosters(offset, limit, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let boosters = await dbModel.findAll({ offset:offset, limit: limit });
            let total = await dbModel.count({ offset:offset, limit: limit });
            return Promise.resolve({success: true, message: "boosters data", data: boosters, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getBoosterById(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let booster = await dbModel.findOne({ where: { booster_id: id } });
            return Promise.resolve({success:true, message: "booster details", data: booster});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateBooster(id, reqBody, authInfo){
        try {
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let booster = await dbModel.findOne({ where: { booster_id: id} });
            if (booster) {
                await dbModel.update(reqBody, { where: { booster_id: id} });
                return Promise.resolve({success:true, message: "booster updated"});
            } else {
                return Promise.resolve({success:false, message: "booster not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
    
    async updateBoosterStatus(id, status, authInfo){
        try {
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let dbModelUser = await dbModels.getModelInstance("users");
            let booster = await dbModel.findOne({ where: {booster_id: id} });
            if(booster) {
                await dbModel.update({status: status}, { where: { booster_id: id} });
                await dbModelUser.update({booster: status}, { where: { user_id: booster.user_ref_id} });
                const subject = (status=="active")? "Congratulations for Booster": "Denied Booster";
                const html = (status=="active")? "Hi, " + "\n Your Are Approved As Booster": "Hi, Denied Booster";
                const text = "";
                let _serviceUserInst = UserService.getInst();
                let user = await _serviceUserInst.getUser(booster.user_ref_id);
                let _serviceInst = MailService.getInst();
                _serviceInst.sendEmail(user.data.email_id, subject, text, html);
                return Promise.resolve({success:true, message: "booster status updated"});
            } else {
                return Promise.resolve({success:false, message: "booster not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new BoosterService();
    }
};
