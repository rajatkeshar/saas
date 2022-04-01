const _             = require('lodash');
const Promise       = require('bluebird');
const country       = require('countries-and-timezones');
const dbModels      = appGlobals.dbModels;
const modelName     = "timezones";
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

class TimezoneService extends BaseService {

    async createTimezones(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let timezones = Object.values(country.getAllTimezones());
            timezones = timezones.map(tz => {
                if(tz.name) {
                    return { timezone_code: tz.name, timezone_name: tz.aliasOf, GMT_plus: tz.utcOffset, daylight: tz.dstOffset };
                }
            })
            await dbModel.bulkCreate(timezones, {ignoreDuplicates: true});
            return Promise.resolve({success: true, message: "timezone saved"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getTimezones(){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let timezones = await dbModel.findAll();
            return Promise.resolve({success:true, message: "timezone details", data: timezones, total: timezones.length});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new TimezoneService();
    }
};
