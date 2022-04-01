const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Country = require(global.appDir + '/db/models/CountriesModel')(sequelize);
    const Language = sequelize.define("language", {
        language_code : {
            type: Sequelize.STRING(4),
            allowNull: false,
            primaryKey: true
        },
        language_name: {
            type: Sequelize.JSON,
            defaultValue: null
        },
        country_code: {
            type: Sequelize.STRING(3),
            // allowNull: false,
            // references: {
            //     model: Country,
            //     key: 'country_code'
            // }
        },
        text_direction: Sequelize.STRING(45),
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)        
    });
    return Language;
}