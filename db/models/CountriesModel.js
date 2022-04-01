const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Country = sequelize.define("country", {
        country_code : {
            type: Sequelize.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        country_name: {
            type: Sequelize.STRING(80),
            defaultValue: null
        },
        population: Sequelize.BIGINT,
        currency_code: Sequelize.STRING(3),
        go_live_date: Sequelize.DATE,
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)
    });
    return Country;
}