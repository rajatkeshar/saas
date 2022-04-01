'use strict';

const models                    = require(global.appDir + '/db/models');
const DBManager                 = require(global.appDir + '/db/DBManager');
const TimezoneService           = require(global.appDir + '/api/services/TimezoneService');
const LanguageService           = require(global.appDir + '/api/services/LanguageService');
const CountriesService          = require(global.appDir + '/api/services/CountriesService');
const CurrenciesService         = require(global.appDir + '/api/services/CurrenciesService');
const IndustriesService         = require(global.appDir + '/api/services/IndustriesService');

const _TimezoneServiceInst      = TimezoneService.getInst();
const _LanguageServiceInst      = LanguageService.getInst();
const _CountriesServiceInst     = CountriesService.getInst();
const _CurrenciesServiceInst    = CurrenciesService.getInst();
const _IndustriesServiceInst    = IndustriesService.getInst();

module.exports.initialize = async function(dbConfig){
    let dbMgr = new DBManager(dbConfig);
    let sequelize = await dbMgr.init();
    await models.init(sequelize); // init models and add them to the exported db object
    await sequelize.sync(); // sync all models with database
    await _CurrenciesServiceInst.createCurrencies(); // dump currency info
    await _CountriesServiceInst.createCountries(); // dump country info
    await _LanguageServiceInst.createLanguages(); // dump lanuages info
    await _TimezoneServiceInst.createTimezones(); // dump timezones info
    await _IndustriesServiceInst.createIndustries(); // dump industries info
};