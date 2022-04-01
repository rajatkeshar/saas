const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Booster =  sequelize.define("booster", {
        booster_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        booster_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        user_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            },
            unique: true
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
        commission_code: {
            type: Sequelize.BIGINT
        },
        per_lead_commission_value: {
            type: Sequelize.INTEGER
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        booster_since: Sequelize.DATE,
        booster_space: Sequelize.STRING(80),
        approx_max_followers: Sequelize.BIGINT,
        active: {
            type: Sequelize.BOOLEAN
        },
        status: {
            type: Sequelize.ENUM("active", "inactive"),
            defaultValue: "active"
        },
        web_content: Sequelize.JSON
    });
    Booster.belongsTo(User, {foreignKey: 'user_ref_id', targetKey: 'user_id', underscored: true});
    return Booster;
}

