const Promise     = require('bluebird');
const Op          = require('sequelize').Op;
const dbModels    = appGlobals.dbModels;
const modelName   = "campaigns";
const utils       = require(global.appDir + '/utils');
const BaseService = require(global.appDir + '/api/services/BaseService.js');
const MailService = require(global.appDir + '/api/services/MailService.js');
const MAX_PUBLISH_COUNT_ALLOWED = config.get('campaign').MAX_PUBLISH_COUNT_ALLOWED;

class CampaignService extends BaseService {

    async createCampaign(reqBody, authInfo){
        try {
            reqBody.user_ref_id = authInfo.user_id;
            reqBody.created_by = authInfo.email_id;
            reqBody.campaign_uuid = utils.Campaign();
            reqBody.maximum_allowed = MAX_PUBLISH_COUNT_ALLOWED;
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.create(reqBody);
            const subject = "Campaign Created";
            const html = "Hi, " + "\n Your Campaign Created Successfully";
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(authInfo.email_id, subject, text, html);
            return Promise.resolve({success: true, message: "campaign created", data: campaign});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCampaigns(query, authInfo){
        try {
            let offset = parseInt(query.offset) || 0;
            let limit = parseInt(query.limit) || 10;
            let where = (query.campaign_type)? {user_ref_id: authInfo.user_id, campaign_type: query.campaign_type, status: { [Op.ne]: "deleted" } }: {user_ref_id: authInfo.user_id, status: { [Op.ne]: "deleted" } };
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaigns = [], total;
            campaigns = await dbModel.findAll({ offset:offset, limit: limit, where: where });
            total = await dbModel.count({ offset:offset, limit: limit, where: where });
            return Promise.resolve({success: true, message: "campaign data", data: campaigns, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCampaignById(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.findOne({ where: {user_ref_id: authInfo.user_id, campaign_id: id, status: { [Op.ne]: "deleted" } } });
            return Promise.resolve({success:true, message: "campaign details", data: campaign});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateCampaign(id, reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.findOne({ where: {user_ref_id: authInfo.user_id, campaign_id: id} });
            let today = new Date();
            if (campaign && campaign.status != "deleted") {
                if(new Date(campaign.campaign_start) >= today && new Date(campaign.campaign_end) <= today) {
                    return Promise.resolve({success:false, message: "campaign is running you can not edit"});
                }
                if(reqBody.img_urls) {
                    campaign.img_urls.push(reqBody.img_urls);
                    reqBody.img_urls = campaign.img_urls;
                }
                delete reqBody.maximum_allowed;
                delete reqBody.campaign_approved;
                delete reqBody.published_count;
                delete reqBody.maximum_allowed;
                reqBody.updated_by = authInfo.email_id;
                await dbModel.update(reqBody, { where: { campaign_id: id} });
                return Promise.resolve({success:true, message: "campaign updated"});
            } else {
                return Promise.resolve({success:false, message: "campaign not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateCampaignStatus(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let dbModelUsers = await dbModels.getModelInstance('users');
            let campaign = await dbModel.findOne({ where: {user_ref_id: authInfo.user_id, campaign_id: id} });
            let today = new Date();
            if(campaign.published_count >= MAX_PUBLISH_COUNT_ALLOWED) {
                return Promise.resolve({success:false, message: "max publish limit exceeds"});
            }
            if(new Date(campaign.campaign_start) >= today && new Date(campaign.campaign_end) <= today) {
                return Promise.resolve({success:false, message: "campaign is running you can not publish it"});
            }
            if(campaign && campaign.status !== "deleted") {
                await dbModel.update({published_count: campaign.published_count + 1, status: "pending", campaign_approved: false}, { where: { campaign_id: id} });
                let subject = "Requeted For Publishing Campaign";
                let html = "Hi, " + "\n Your Request Has Been Sent To Admin We Will Get Back To You Soon. Thanks";
                let text = "";
                let _serviceInst = MailService.getInst();
                _serviceInst.sendEmail(authInfo.email_id, subject, text, html);
                let getAdminUsers = await dbModelUsers.findAll({ where: { user_role: "admin" }, attributes: ['email_id'] });
                let getAdminMailId = getAdminUsers.map((a) => {return a.email_id});
                if(getAdminMailId.length) {
                    let subject = "New Request For Publishing campaign";
                    let html = "Hi, " + "\n Your Got A New Request For Publish A Campaign.";
                    let text = "";
                    _serviceInst.sendEmail(getAdminMailId, subject, text, html);
                }
                return Promise.resolve({success:true, message: "campaign publish request sent to admin"});
            } else {
                return Promise.resolve({success:false, message: "campaign not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async deleteCampaign(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            await dbModel.update({status: "deleted"}, {user_ref_id: authInfo.user_id, where: { campaign_id: id} });
            const subject = "Campaign Deleted";
            const html = "Hi, " + "\n Your Campaign Deleted Successfully";
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(authInfo.email_id, subject, text, html);
            return Promise.resolve({success:true, message: "campaign deleted"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCampaignUuid(query, authInfo){
        try {
            let offset = parseInt(query.offset) || 0;
            let limit = parseInt(query.limit) || 10;
            let dbModel = await dbModels.getModelInstance(modelName);
            let dbModelBoosterLinks = await dbModels.getModelInstance('booster_links');
            let campaigns = await dbModel.findAll({ offset:offset, limit: limit, where: {status: "active"}, attributes: ['campaign_uuid', 'campaign_type', 'campaign_description', 'campaign_start', 'campaign_end'] });
            let total = await dbModel.count({ offset:offset, limit: limit, where: {status: "active"} });
            let BoosterLinks = await dbModelBoosterLinks.findAll({ where: {user_ref_id: authInfo.user_id, status: { [Op.ne]: "inactive" }}, attributes: ['campaign_ref_uuid', 'booster_ref_uuid', 'booster_token', 'user_name'] });
            campaigns = JSON.parse(JSON.stringify(campaigns));
            campaigns.forEach(c => {
                let Index = BoosterLinks.findIndex(b => b.campaign_ref_uuid === c.campaign_uuid);
                if(BoosterLinks[Index]) {
                    c.isBooster = true
                    c.booster_token = BoosterLinks[Index].booster_token;
                    c.booster_uuid = BoosterLinks[Index].booster_ref_uuid;
                    c.user_name = BoosterLinks[Index].user_name;
                }
            });
            return Promise.resolve({success: true, message: "campaign data", data: campaigns, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCampaignByUuid(uuid, username){
        try {
            let arr = uuid.split('-'), booster_registration_number=null;
            if(arr.length === 7) {
                booster_registration_number = arr.pop();
                uuid = arr.join('-');
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.findOne({ where: {campaign_uuid: uuid }, attributes: ['campaign_uuid', 'campaign_type', 'campaign_description', 'campaign_start', 'campaign_end', 'industry_ref_id', 'img_urls', 'web_content'] });
            campaign = JSON.parse(JSON.stringify(campaign))
            if(campaign) {
                if(booster_registration_number) {
                    let dbModelBoosterLinks = await dbModels.getModelInstance('booster_links');
                    let BoosterLinks = await dbModelBoosterLinks.findOne({ where: {booster_registration_number: booster_registration_number, status: { [Op.ne]: "inactive" }}, attributes: ['campaign_ref_uuid', 'booster_ref_uuid', 'booster_token', 'user_name'] });
                    if(username !== BoosterLinks.user_name) {
                        return Promise.resolve({success:false, message: "booster username invalid"});
                    }
                    if(BoosterLinks) {
                        campaign.isBooster = true
                        campaign.booster_token = BoosterLinks.booster_token;
                        campaign.booster_uuid = BoosterLinks.booster_ref_uuid;
                    } else {
                        return Promise.resolve({success:false, message: "booster not found"});
                    }
                }
                return Promise.resolve({success:true, message: "campaign details", data: campaign});
            } else {
                return Promise.resolve({success:false, message: "campaign not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new CampaignService();
    }
};
