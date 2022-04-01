const _           = require('lodash');
const Promise     = require('bluebird');
const country     = require('countries-db');
const dbModels    = appGlobals.dbModels;
const modelName   = "currencies";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class CurrenciesService extends BaseService {

    async createCurrencies(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let countries = Object.values(country.getAllCountries());
            countries = countries.map(c => {
                if(c.name) {
                    return { currency_code: c.currencyCode, currency_name: c.currencyName };
                }
            })
            await dbModel.bulkCreate(countries, {ignoreDuplicates: true});
            return Promise.resolve({success: true, message: "currencies saved"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCurrencies(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let currencies = await dbModel.findAll();
            return Promise.resolve({success:true, message: "currencies details", data: currencies, total: currencies.length});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new CurrenciesService();
    }
};
