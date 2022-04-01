const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const Subscription =  sequelize.define("subscription", {
        subscription_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        subscription_name: Sequelize.STRING(20),
        subscription_description: Sequelize.STRING(20),
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM("active", "inactive"),
            defaultValue: "active"
        },
        token_id: {
            type: Sequelize.BIGINT
        },
        subscription_type: {
            type: Sequelize.ENUM("free", "normal", "premium", "gold", "platinum"),
            defaultValue: "free"
        },
        external_reference: {
            type: Sequelize.STRING(45)
        },
        hierarchy_id: Sequelize.INTEGER,
        blockchain_transaction_ref: Sequelize.STRING(256),
        web_content: Sequelize.JSON
    });
    return Subscription;
}

