const Sequelize = require("sequelize");

module.exports = function(sequelize) {  
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Order =  sequelize.define("order", {
        order_id: {
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
            }
        },
        entity: Sequelize.STRING,
        amount: Sequelize.BIGINT,
        amount_paid: Sequelize.BIGINT,
        amount_due: Sequelize.BIGINT,
        currency: Sequelize.STRING,
        receipt: Sequelize.STRING,
        offer_id: Sequelize.STRING,
        status: {
            type: Sequelize.STRING,
            defaultValue: "created",
        },
        attempts: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        notes: {
            type: Sequelize.JSON,
            defaultValue: [],
        },
        created_by: Sequelize.STRING(50),
        updated_by: Sequelize.STRING(50)
    });
    return Order;
}

