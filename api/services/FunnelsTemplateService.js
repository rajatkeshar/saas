const Promise     = require('bluebird');
const dbModels    = appGlobals.dbModels;
const modelName   = "templates";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class FunnelsTemplateService extends BaseService {

    async getTemplates(offset, limit){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let templates = await dbModel.findAll({ where: { status: "active" } }, { offset:offset, limit: limit });
            let total = await dbModel.count({ where: { status: "active" } }, { offset:offset, limit: limit, status: "active" });
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
};

module.exports = {
    getInst : function (){
        return new FunnelsTemplateService();
    }
};
