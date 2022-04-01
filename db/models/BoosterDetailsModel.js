const Sequelize = require("sequelize");

module.exports = function(sequelize) {
    const User = require(global.appDir + '/db/models/UsersModel')(sequelize);
    const Booster = require(global.appDir + '/db/models/BoostersModel')(sequelize);
    const BoosterDetail =  sequelize.define("booster_detail", {
        booster_trs_id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        booster_ref_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
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
        commission_paid_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        commission_transaction_ref: {
            type: Sequelize.INTEGER(10)
        },
        token_string: {
            type: Sequelize.STRING(255)
        },
        payment_gateway_transaction_id: Sequelize.STRING(255),
        transaction_type: Sequelize.STRING(45),
        remarks: Sequelize.STRING(255),
        active: {
            type: Sequelize.BOOLEAN
        },
        web_content: Sequelize.JSON
    });
    BoosterDetail.belongsTo(User, {foreignKey: 'user_ref_id', targetKey: 'user_id', underscored: true});
    BoosterDetail.belongsTo(Booster, {foreignKey: 'boster_ref_id', targetKey: 'booster_id', underscored: true});
    return Booster;
}

