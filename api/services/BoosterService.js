const crypto        = require('crypto');
const Promise       = require('bluebird');
const dbModels      = appGlobals.dbModels;
const BOOSTERS      = "boosters";
const CAMPAIGNS     = "campaigns";
const BOOSTER_LINKS = "booster_links";
const utils         = require(global.appDir + '/utils');
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

class BoosterService extends BaseService {

    async createBooster(reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(BOOSTERS);
            let dbModelCampaigns = await dbModels.getModelInstance(CAMPAIGNS);
            let dbModelBoosterLinks = await dbModels.getModelInstance(BOOSTER_LINKS);
            let campaign = await dbModelCampaigns.findOne({ where: { campaign_uuid: reqBody.campaign_ref_uuid } });
            if(!campaign) {
                return Promise.resolve({success: false, message: "invalid campaign"});
            }
            let booster = await dbModel.findOne({ where: { user_ref_id: authInfo.user_id } });
            let unique_number = new Date().valueOf();
            if(booster && booster.status === "active") {
                let booster_links = await dbModelBoosterLinks.findOne({ where: { campaign_ref_uuid: reqBody.campaign_ref_uuid, user_ref_id: authInfo.user_id } });
                if(booster_links) {
                    return Promise.resolve({success: false, message: "booster links already exists"});
                }
                reqBody.booster_ref_id = booster.booster_id;
                reqBody.user_ref_id = authInfo.user_id;
                reqBody.booster_ref_uuid = booster.booster_uuid;
                reqBody.booster_registration_number = unique_number;
                reqBody.booster_token = reqBody.campaign_ref_uuid + "-" + unique_number;
                reqBody.user_name = authInfo.user_name;
                booster_links = await dbModelBoosterLinks.create(reqBody);
                return Promise.resolve({success: true, message: "booster created", data: booster_links});
            } else {
                return Promise.resolve({success: false, message: "user is not booster"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getBoosters(offset, limit, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(BOOSTER_LINKS);
            let total = await dbModel.count({ offset:offset, limit: limit });
            let boosters = await dbModel.findAll({ offset:offset, limit: limit, attributes: ['booster_link_id', 'user_ref_id', 'booster_ref_uuid', 'campaign_ref_uuid', 'booster_type', 'booster_token', 'status'] });
            return Promise.resolve({success: true, message: "boosters data", data: boosters, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getBoosterById(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(BOOSTER_LINKS);
            let booster = await dbModel.findOne({ where: { booster_link_id: id } });
            return Promise.resolve({success:true, message: "booster details", data: booster});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
    
    async updateBoosterStatus(id, status, authInfo){
        try {
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(BOOSTER_LINKS);
            let booster = await dbModel.findOne({ where: {booster_link_id: id} });
            if(booster) {
                await dbModel.update({status: status}, { where: { booster_link_id: id} });
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
