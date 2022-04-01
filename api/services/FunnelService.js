const Promise     = require('bluebird');
const Op          = require('sequelize').Op;
const modelName   = "funnels";
const dbModels    = appGlobals.dbModels;
const BaseService = require(global.appDir + '/api/services/BaseService.js');
const MailService = require(global.appDir + '/api/services/MailService.js');

class FunnelService extends BaseService {

    async createFunnel(reqBody, authInfo){
        try {
            let dbModelTemplates = await dbModels.getModelInstance('templates');
            let template = await dbModelTemplates.findOne({ where: { template_id: reqBody.template_id, status: { [Op.ne]: "deleted" } } });
            if(!template) {
                return Promise.resolve({success:false, message: "template not found"});
            }
            reqBody.funnel_name = reqBody.funnel_name || template.template_name;
            reqBody.funnel_type = reqBody.funnel_type || template.template_type;
            reqBody.industry_ref_id = template.industry_ref_id;
            reqBody.created_by = authInfo.email_id;
            reqBody.user_id = authInfo.user_id;
            let dbModel = await dbModels.getModelInstance(modelName);
            let funnel = await dbModel.create(reqBody);
            const subject = "Funnel Created";
            const html = "Hi, " + "\n Congratulations, Your Funnel Created Successfully";
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(authInfo.email_id, subject, text, html);
            return Promise.resolve({success: true, message: "funnel created", data: funnel});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getFunels(offset, limit, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let funnels = await dbModel.findAll({ offset:offset, limit: limit, where: { user_id: authInfo.user_id, status: { [Op.ne]: "deleted" } } });
            let total = await dbModel.count({ offset:offset, limit: limit, where: {user_id: authInfo.user_id, status: { [Op.ne]: "deleted" } } });
            return Promise.resolve({success: true, message: "funnels data", data: funnels, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getFunnelById(id, authInfo){
        try {
            // let Template = await dbModels.getModelInstance("templates"); 
            let dbModel = await dbModels.getModelInstance(modelName);
            // let temp_attr = ['template_id','template_name', 'template_type', 'subscription_id', 'price', 'industry_ref_id', 'external_reference', 'price_reference'];
            // let funnel = await dbModel.findOne({ where: {user_id: authInfo.user_id, funnel_id: id, status: { [Op.ne]: "deleted" } }, include: [{model:Template, attributes: temp_attr}] });
            let funnel = await dbModel.findOne({ where: {user_id: authInfo.user_id, funnel_id: id } });
            return Promise.resolve({success:true, message: "funnel details", data: funnel});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateFunnel(id, reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let funnel = await dbModel.findOne({ where: {user_id: authInfo.user_id, funnel_id: id} });
            if(funnel.published) {
                return Promise.resolve({success:false, message: "funnel already published"});
            }
            if (funnel && funnel.status != "deleted") {
                if(reqBody.img_urls) {
                    funnel.img_urls.push(reqBody.img_urls);
                    reqBody.img_urls = funnel.img_urls;
                }
                reqBody.updated_by = authInfo.email_id;
                await dbModel.update(reqBody, { where: { funnel_id: id} });
                return Promise.resolve({success:true, message: "funnel updated"});
            } else {
                return Promise.resolve({success:false, message: "funnel not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message}); 
        }
    }

    async updateFunnelStatus(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let funnel = await dbModel.findOne({ where: {user_id: authInfo.user_id, funnel_id: id} });
            if(funnel.published) {
                return Promise.resolve({success:false, message: "funnel already published"});
            }
            
            if(funnel && funnel.status !== "deleted") {
                await dbModel.update({published: true}, { where: { funnel_id: id} });
                return Promise.resolve({success:true, message: "funnel published"});
            } else {
                return Promise.resolve({success:false, message: "funnel not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async deleteFunnel(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            await dbModel.update({status: "deleted"}, { where: {user_id: authInfo.user_id, funnel_id: id} });
            const subject = "Funnel Deleted";
            const html = "Hi, " + "\n Your Funnel Deleted Successfully";
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(authInfo.email_id, subject, text, html);
            return Promise.resolve({success:true, message: "funnel deleted"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new FunnelService();
    }
};
