const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Region = sequelize.define("region", {
        region_code : {
            type: Sequelize.STRING(4),
            allowNull: false,
            //autoIncrement: true,
            //primaryKey: true
        },
        region_name: {
            type: Sequelize.STRING(45),
            defaultValue: null
        },
        region_description: Sequelize.STRING(45),
        head_location_code: Sequelize.BIGINT,
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)        
    });
    return Region;
}