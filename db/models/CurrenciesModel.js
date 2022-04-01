const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Currency = sequelize.define("currency", {
        currency_code : {
            type: Sequelize.STRING(3),
            allowNull: false,
            primaryKey: true
        },
        currency_name: {
            type: Sequelize.STRING(30),
            defaultValue: null
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)        
    });
    return Currency;
}