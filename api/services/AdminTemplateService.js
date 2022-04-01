const Promise     = require('bluebird');
const dbModels    = appGlobals.dbModels;
const modelName   = "templates";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class FunnelsTemplateService extends BaseService {

    async createTemplate(reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            if(authInfo.user_role !== "admin") {
                return Promise.resolve({success: false, message: "you are not authorized to create template"});
            }
            reqBody.template_owner_id = authInfo.user_id;
            reqBody.created_by = authInfo.email_id;
            let template = await dbModel.create(reqBody);
            return Promise.resolve({success: true, message: "template created", data: template});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getTemplates(offset, limit){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let templates = await dbModel.findAll({ offset:offset, limit: limit });
            let total = await dbModel.count({ offset:offset, limit: limit });
            return Promise.resolve({success: true, message: "templates", data: templates, total: total});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getTemplateById(id){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let template = await dbModel.findOne({ where: { template_id: id } });
            return Promise.resolve({success:true, message: "template details", data: template});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateTemplate(id, reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let template = await dbModel.findOne({ where: { template_id: id} });
            
            if (template) {
                if(reqBody.img_urls) {
                    template.img_urls.push(reqBody.img_urls);
                    reqBody.img_urls = template.img_urls;
                }
                reqBody.updated_by = authInfo.email_id;
                await dbModel.update(reqBody, { where: { template_id: id} });
                return Promise.resolve({success:true, message: "template updated"});
            } else {
                return Promise.resolve({success:false, message: "template not found"});
            }
        } catch (error) {
            console.log("error: ", error);
            return Promise.reject({success: false, message: error.message});
        }
    }

    async deleteTemplate(id, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let update = {status: "deleted"};
            let cond = { where: { template_id: 1} };
            const result = await dbModel.update({status: "deleted"}, { where: { template_id: id} });
            return Promise.resolve({success:true, message: "template deleted"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new FunnelsTemplateService();
    }
};
