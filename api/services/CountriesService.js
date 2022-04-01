const _           = require('lodash');
const Promise     = require('bluebird');
const country     = require('countries-db');
const dbModels    = appGlobals.dbModels;
const modelName   = "countries";
const BaseService = require(global.appDir + '/api/services/BaseService.js');

class CountriesService extends BaseService {

    async createCountries(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let countries = Object.values(country.getAllCountries());
            countries = countries.map(c => {
                if(c.name) {
                    return { country_code: c.id, country_name: c.name, population: c.population, currency_code: c.currencyCode };
                }
            })
            await dbModel.bulkCreate(countries, {ignoreDuplicates: true});
            return Promise.resolve({success: true, message: "countries saved"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getCountries(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let countries = await dbModel.findAll();
            return Promise.resolve({success:true, message: "countries details", data: countries, total: countries.length});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new CountriesService();
    }
};
