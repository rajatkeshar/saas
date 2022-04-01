const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Country = require(global.appDir + '/db/models/CountriesModel')(sequelize);
    const Industry = sequelize.define("industry", {
        industry_id : {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        industry_name: {
            type: Sequelize.STRING(80),
            defaultValue: null
        },
        industry_description: Sequelize.STRING(150),
        region_code: Sequelize.STRING(10),
        country_code: {
            type: Sequelize.STRING(3),
            allowNull: false,
            references: {
                model: Country,
                key: 'country_code'
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)
    });
    return Industry;
}