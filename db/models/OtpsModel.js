const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);  
    const Otp =  sequelize.define("otp", {
        visitor_email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        otp: {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Otp;
}

