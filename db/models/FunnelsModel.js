const Sequelize = require("sequelize");

module.exports = function(sequelize) {  
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Industry = require(global.appDir + '/db/models/IndustriesModel')(sequelize);
    const Template = require(global.appDir + '/db/models/TemplateModel')(sequelize);
    const Funnel =  sequelize.define("funnel", {
        funnel_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        industry_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Industry,
                key: 'industry_id'
            }
        },
        funnel_name: Sequelize.STRING(40),
        funnel_type: Sequelize.STRING(18),
        template_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Template,
                key: 'template_id'
            }
        },
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
            //defaultValue: true
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "deleted", "pending", "rejected", "completed"),
            defaultValue: "active"
        },
        message: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        created_by: Sequelize.STRING(50),
        updated_by: Sequelize.STRING(50),
        img_urls: {
            type: Sequelize.JSON,
            defaultValue: [],
        },
        web_content: Sequelize.JSON
    });
    User.hasMany(Funnel, {foreignKey: 'user_id'});
    Funnel.belongsTo(User, {foreignKey: 'user_id'});
    Template.hasMany(Funnel, {foreignKey: 'template_id'});
    Funnel.belongsTo(Template, {foreignKey: 'template_id'});
    return Funnel;
}

