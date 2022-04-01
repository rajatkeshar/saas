const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Timezone = sequelize.define("timezone", {
        timezone_code : {
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        timezone_name: {
            type: Sequelize.STRING(50),
            defaultValue: null
        },
        GMT_plus: Sequelize.INTEGER,
        daylight: Sequelize.INTEGER,
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)        
    });
    return Timezone;
}