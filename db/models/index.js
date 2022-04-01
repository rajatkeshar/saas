'use strict';

let models = {};

module.exports.getModelInstance = async function(name){
    return models[name];
};

module.exports.init  = async function(sequelize){
    models.currencies = require('./CurrenciesModel')(sequelize);
    models.countries = require('./CountriesModel')(sequelize);
    models.industries = require('./IndustriesModel')(sequelize);
    models.languages = require('./LanguagesModel')(sequelize);
    models.timezones = require('./TimezonesModel')(sequelize);
    models.users = require('./UsersModel')(sequelize);
    models.campaigns = require('./CampaignsModel')(sequelize);
    models.templates = require('./TemplateModel')(sequelize);
    models.boosters = require('./BoostersModel')(sequelize);
    models.booster_links = require('./BoosterLinksModel')(sequelize);
    //models.booster_details = require('./BoosterDetailsModel')(sequelize);
    //models.subscriptions = require('./SubscriptionsModel')(sequelize);
    //models.subscription_details = require('./SubscriptionDetailsModel')(sequelize);
    models.customers = require('./CustomersModel')(sequelize);
    models.funnels = require('./FunnelsModel')(sequelize);
    models.otps = require('./OtpsModel')(sequelize);
    models.orders = require('./OrdersModel')(sequelize);
};
