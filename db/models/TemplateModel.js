const Sequelize = require("sequelize");

module.exports = function(sequelize) {  
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Industry = require(global.appDir + '/db/models/IndustriesModel')(sequelize);
    const Template =  sequelize.define("template", {
        template_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        template_name: Sequelize.STRING(40),
        template_type: Sequelize.STRING(18),
        payload_id: Sequelize.BIGINT,
        subscription_id: Sequelize.BIGINT,
        price: Sequelize.DECIMAL(10,0),
        valid_from: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        valid_till: {
            type: Sequelize.DATE
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        template_owner_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "deleted"),
            defaultValue: "active"
        },
        industry_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Industry,
                key: 'industry_id'
            }
        },
        external_reference: Sequelize.STRING,
        created_by: Sequelize.STRING(50),
        updated_by: Sequelize.STRING(50),
        max_capacity: Sequelize.INTEGER,
        min_capacity: Sequelize.INTEGER,
        price_reference: Sequelize.BIGINT,
        default_validity_period: Sequelize.STRING(10),
        element_id: Sequelize.BIGINT,
        img_urls: {
            type: Sequelize.JSON,
            defaultValue: [],
        },
        web_content: Sequelize.JSON
    });
    return Template;
}

