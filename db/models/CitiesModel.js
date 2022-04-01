const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const City = sequelize.define("city", {
        city_code : {
            type: Sequelize.STRING(5),
            allowNull: false,
            primaryKey: true
        },
        city_name: {
            type: Sequelize.STRING(80),
            defaultValue: null
        },
        country_code: Sequelize.STRING(3),
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)
    });
    return City;
}