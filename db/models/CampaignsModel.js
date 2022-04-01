const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Funnel = require(global.appDir + '/db/models/FunnelsModel')(sequelize);  
    const Industry = require(global.appDir + '/db/models/IndustriesModel')(sequelize);
    const Campaign =  sequelize.define("campaign", {
        campaign_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        campaign_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        campaign_type: {
            type: Sequelize.ENUM("email", "webinar", "sale_product"),
            defaultValue: "email"
        },
        campaign_description: Sequelize.STRING(255),
        campaign_start: {
            type: Sequelize.DATE
        },
        campaign_end: {
            type: Sequelize.DATE
        },
        user_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        funnel_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Funnel,
                key: 'funnel_id'
            }
        },
        industry_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Industry,
                key: 'industry_id'
            }
        },
        industry_transaction_ref: Sequelize.BIGINT,
        external_url: Sequelize.STRING(250),
        active: {
            type: Sequelize.BOOLEAN
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "deleted", "pending", "rejected", "completed"),
            defaultValue: "inactive"
        },
        created_by: Sequelize.STRING(50),
        updated_by: Sequelize.STRING(50),
        open_to_market: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        open_to_market_until: Sequelize.DATE,
        payload_id: Sequelize.BIGINT,
        published_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        maximum_allowed: Sequelize.BIGINT,
        campaign_approved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        campaign_approved_on: Sequelize.DATE,
        message: Sequelize.STRING(255),
        img_urls: {
            type: Sequelize.JSON,
            defaultValue: [],
        },
        web_content: Sequelize.JSON
    });
    //User.hasMany(Campaign);
    //Campaign.belongsTo(User, {foreignKey: 'fk_user_id', targetKey: 'user_id', underscored: true});
    return Campaign;
}

