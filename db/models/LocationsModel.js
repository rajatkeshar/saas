const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Location = sequelize.define("location", {
        location_code : {
            type: Sequelize.BIGINT,
            allowNull: false,
            //autoIncrement: true,
            //primaryKey: true
        },
        location_name: {
            type: Sequelize.STRING(80),
            defaultValue: null
        },
        location_full_text: Sequelize.STRING(155),
        region_code: Sequelize.STRING(10),
        location_type: Sequelize.STRING(12),
        country_code: Sequelize.STRING(3),
        longitude: Sequelize.DECIMAL(11,8),
        latitude: Sequelize.DECIMAL(10,8),
        timezone_code: Sequelize.STRING(8),
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        google_map_link: Sequelize.STRING(150),
        postal_code: Sequelize.STRING(45),
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        city_code: Sequelize.STRING(5),
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12)
    });
    return Location;
}