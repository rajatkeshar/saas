const Promise     = require('bluebird');
const dbModels    = appGlobals.dbModels;
const modelName   = "campaigns";
const Op          = require('sequelize').Op;
const BaseService = require(global.appDir + '/api/services/BaseService.js');
const MailService = require(global.appDir + '/api/services/MailService.js');
const UserService = require(global.appDir + '/api/services/UserService.js');

class AdminCampaignService extends BaseService {

    async getCampaigns(offset, limit, status){
        try {
            let where = (status)? {status: status}: {status: ["active", "pending", "rejected"] };
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaigns = await dbModel.findAll({ offset:offset, limit: limit, where: where });
            let total = await dbModel.count({ offset:offset, limit: limit, where: where });
            return Promise.resolve({success: true, message: "campaign data", data: campaigns, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCampaignById(id){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.findOne({ where: { campaign_id: id } });
            return Promise.resolve({success:true, message: "campaign details", data: campaign});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateCampaign(id, reqBody, authInfo){
        try {
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to perform this action"});
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let campaign = await dbModel.findOne({ where: { campaign_id: id} });
            let mand_keys = ["status", "campaign_approved"];
  
            for (let i = 0, ilen = mand_keys.length; i < ilen; ++i) {
                if (!reqBody.hasOwnProperty(mand_keys[i])) {
                    return Promise.resolve({ success: false, message: `reqBody_${mand_keys[i]}_key_missing`});   
                }
            }

            if (campaign) {
                await dbModel.update({updated_by: authInfo.email_id, campaign_approved: reqBody.campaign_approved, campaign_approved_on: new Date(), status: reqBody.status, message: reqBody.message}, { where: { campaign_id: id} });
                const subject = (reqBody.campaign_approved)? "Campaign Approved": "Campaign Not Approved";
                const html = (reqBody.campaign_approved)? "Hi, " + "\n Your Campaign Approved": "Hi, " + "\n Your Campaign Not Approved";
                const text = "";
                let _serviceUserInst = UserService.getInst();
                let user = await _serviceUserInst.getUser(campaign.user_ref_id);
                let _serviceMailInst = MailService.getInst();
                _serviceMailInst.sendEmail(user.data.email_id, subject, text, html);
                return Promise.resolve({success:true, message: "campaign status updated"});
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
        return new AdminCampaignService();
    }
};
