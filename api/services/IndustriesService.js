const _             = require('lodash');
const Promise       = require('bluebird');
const dbModels      = appGlobals.dbModels;
const modelName     = "industries";
const industriesList = config.get('industries').list;
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

class LanguageService extends BaseService {

    async createIndustries(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            await dbModel.bulkCreate(industriesList, {ignoreDuplicates: true});
            return Promise.resolve({success: true, message: "industries saved"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getIndustries(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let industries = await dbModel.findAll();
            return Promise.resolve({success:true, message: "industries details", data: industries, total: industries.length});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new LanguageService();
    }
};