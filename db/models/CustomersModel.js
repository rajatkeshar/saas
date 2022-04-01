const Sequelize = require("sequelize");

module.exports = function(sequelize) {

    // const Booster  = require(global.appDir + '/db/models/BoostersModel')(sequelize);
    // const Campaign = require(global.appDir + '/db/models/CampaignsModel')(sequelize);
    const Country  = require(global.appDir + '/db/models/CountriesModel')(sequelize);
    const Language = require(global.appDir + '/db/models/LanguagesModel')(sequelize);
    const Timezone = require(global.appDir + '/db/models/TimezonesModel')(sequelize);
    const Currency = require(global.appDir + '/db/models/CurrenciesModel')(sequelize);
    const Customer = sequelize.define("customer", {
        cust_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        campaign_type: {
            allowNull: false,
            type: Sequelize.ENUM("email", "webinar", "sale_product"),
        },
        profile_pic_url: Sequelize.STRING(255),
        display_name: Sequelize.STRING(50),
        first_name: Sequelize.STRING(50),
        last_name: Sequelize.STRING(50),
        email_id: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        source: {
            type: Sequelize.ENUM("web", "booster")
        },
        campaign_ref_uuid: {
            type: Sequelize.STRING,
            // references: {
            //     model: Campaign,
            //     key: 'campaign_uuid'
            // }
        },
        booster_ref_uuid: {
            type: Sequelize.STRING,
            // references: {
            //     model: Booster,
            //     key: 'booster_uuid'
            // }
        },
        mobile_number: Sequelize.STRING(20),
        primary_phone: Sequelize.STRING(20),
        secondary_phone: Sequelize.STRING(20),
        national_id: Sequelize.STRING(15),
        primary_address1: Sequelize.STRING(255),
        primary_address2: Sequelize.STRING(255),
        primary_address3: Sequelize.STRING(255),
        city: Sequelize.STRING(5),
        state: Sequelize.STRING(10),
        pin_zip_code: Sequelize.INTEGER(11),
        registration_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        last_login_time: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        locked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        customer_type: Sequelize.STRING(18),
        user_role: {
            type: Sequelize.ENUM("customer"),
            defaultValue: "customer"
        },
        user_name: Sequelize.STRING(12),
        defult_language: {
            type: Sequelize.STRING(4),
            references: {
                model: Language,
                key: 'language_code'
            }
        },
        preferred_language: {
            type: Sequelize.STRING(4),
            references: {
                model: Language,
                key: 'language_code'
            }
        },
        default_currency: {
            type: Sequelize.STRING(3),
            references: {
                model: Currency,
                key: 'currency_code'
            }
        },
        preferred_currency: {
            type: Sequelize.STRING(3),
            references: {
                model: Currency,
                key: 'currency_code'
            }
        },
        created_by: Sequelize.STRING(12),
        updated_by: Sequelize.STRING(12),
        status: {
            type: Sequelize.ENUM("active", "inactive", "deleted"),
            defaultValue: "active"
        },
        title: Sequelize.STRING(18),
        password: Sequelize.STRING(200),
        timezone_code: {
            type: Sequelize.STRING(50),
            references: {
                model: Timezone,
                key: 'timezone_code'
            }
        },
        date_format: Sequelize.DATE,
        subscription_id: Sequelize.BIGINT,
        gender: Sequelize.ENUM("male", "female"),
        location_code: Sequelize.BIGINT,
        country: {
            type: Sequelize.STRING(3),
            references: {
                model: Country,
                key: 'country_code'
            }
        }
    }, {
        uniqueKeys: {
            Items_unique: {
                fields: ['campaign_ref_uuid', 'email_id']
            }
        }
    });
    // Customer.hasMany(Campaign);
    // Campaign.belongsTo(Customer, {foreignKey: 'campaign_uuid', targetKey: 'campaign_ref_uuid', underscored: true});
    //Customer.hasMany(Booster);
    return Customer;
}

