const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Subscription = require(global.appDir + '/db/models/SubscriptionsModel')(sequelize);
    const SubscriptionDetails =  sequelize.define("subscription_detail", {
        subscription_transaction_ref: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        subscription_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Subscription,
                key: 'subscription_id'
            },
            unique: true
        },
        subscriped_date: {
            type: Sequelize.DATE
        },
        valid_from: {
            type: Sequelize.DATE
        },
        valid_to: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM("active", "inactive"),
            defaultValue: "active"
        },
        payment_id: {
            type: Sequelize.STRING(256)
        },
        pricing_reference: Sequelize.INTEGER,
        web_content: Sequelize.JSON
    });
    SubscriptionDetails.belongsTo(User, {foreignKey: 'user_ref_id', targetKey: 'user_id', underscored: true});
    return SubscriptionDetails;
}

