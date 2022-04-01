const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Country = require(global.appDir + '/db/models/CountriesModel')(sequelize);
    const State = sequelize.define("state", {
        state_code : {
            type: Sequelize.STRING(10),
            allowNull: false,
            //autoIncrement: true,
            //primaryKey: true
        },
        state_name: {
            type: Sequelize.STRING(40),
            defaultValue: null
        },
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
    return State;
}