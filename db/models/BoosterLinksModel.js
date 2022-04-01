const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Booster = require(global.appDir + '/db/models/BoostersModel')(sequelize);
    const Campaign = require(global.appDir + '/db/models/CampaignsModel')(sequelize);
    const BoosterLinks =  sequelize.define("booster_link", {
        booster_link_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        booster_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Booster,
                key: 'booster_id'
            }
        },
        user_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        user_name: {
            type: Sequelize.STRING
        },
        booster_ref_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        campaign_ref_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        booster_type: {
            type: Sequelize.ENUM("free", "normal", "premium"),
            defaultValue: "free"
        },
        booster_registration_number: {
            type: Sequelize.STRING(120),
            allowNull: false,
            primaryKey: true
        },
        booster_token: {
            type: Sequelize.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("active", "inactive"),
            defaultValue: "active"
        },
        web_content: Sequelize.JSON
    });
    BoosterLinks.belongsTo(User, {foreignKey: 'user_ref_id', targetKey: 'user_id', underscored: true});
    return BoosterLinks;
}

