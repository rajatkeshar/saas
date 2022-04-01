const _             = require('lodash');
const Promise       = require('bluebird');
const country       = require('countries-db');
const dbModels      = appGlobals.dbModels;
const modelName     = "languages";
const languagesList = config.get('languages').lang;
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

class LanguageService extends BaseService {

    async createLanguages(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let countries = Object.values(country.getAllCountries());
            //countries = countries.map(c => {
                //console.log("c.languages[0]: ", c.languages);
                //if(c.id && c.languages) {
                    //return { language_code: c.languages[0], language_name: languagesList[c.languages[0]], country_code: c.id };
                //}
            //})
            let languages = [];
            for (const key in languagesList) {
                if (Object.hasOwnProperty.call(languagesList, key)) {
                    languages.push({ language_code: key, language_name: languagesList[key] })
                }
            }
            await dbModel.bulkCreate(languages, {ignoreDuplicates: true});
            return Promise.resolve({success: true, message: "languages saved"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getLanguages(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let languages = await dbModel.findAll();
            return Promise.resolve({success:true, message: "languages details", data: languages, total: languages.length});
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
