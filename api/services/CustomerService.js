const Promise     = require('bluebird');
const dbModels    = appGlobals.dbModels;
const modelName   = "customers";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class CustomerService extends BaseService {

    async createCustomer(req){
        try {
            let reqBody = req.body, booster_token = null, boosterLinks = null;
            let arr = req.params.campaign_uuid.split('-');
            let source = (arr.length === 7)? 'booster': 'web';
            if(source === 'booster') {
                booster_token = arr.pop();
                req.params.campaign_uuid = arr.join('-');
            }
            let dbModelCampaign = await dbModels.getModelInstance("campaigns");
            let campaign = await dbModelCampaign.findOne({where: {campaign_uuid: req.params.campaign_uuid}});
            if(campaign) {
                if(booster_token) {
                    let dbModelBoosterLinks = await dbModels.getModelInstance("booster_links");
                    boosterLinks = await dbModelBoosterLinks.findOne({where: {booster_registration_number: booster_token}, attributes: ['booster_ref_uuid']});
                    if(!boosterLinks) {
                        return Promise.resolve({success: false, message: "invalid booster token"});
                    }
                    reqBody.booster_ref_uuid = boosterLinks.booster_ref_uuid;
                }
                reqBody.source = source;
                reqBody.campaign_type = campaign.campaign_type;
                reqBody.campaign_ref_uuid = req.params.campaign_uuid;
                let dbModel = await dbModels.getModelInstance(modelName);
                await dbModel.upsert(reqBody);
                return Promise.resolve({success: true, message: "customer created", data: null});
            } else {
                return Promise.resolve({success: false, message: "invalid campaign uuid"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCustomers(query, campaign_uuid, authInfo){
        try {
            let offset = parseInt(query.offset) || 0;
            let limit = parseInt(query.limit) || 10;
            let where = {campaign_ref_uuid: campaign_uuid};
            if(query.source) {
                where.source = query.source;
            }
            let dbModel = await dbModels.getModelInstance(modelName);
            let customers = await dbModel.findAll({ offset:offset, limit: limit, where: where, attributes: ['cust_id', 'campaign_type', 'profile_pic_url', 'display_name', 'first_name', 'last_name', 'email_id', 'source'] });
            let total = await dbModel.count({ offset:offset, limit: limit, where: where });
            return Promise.resolve({success: true, message: "customers data", data: customers, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCustomerById(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let customer = await dbModel.findOne({ where: {cust_id: id} });
            return Promise.resolve({success:true, message: "customer details", data: customer});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new CustomerService();
    }
};
