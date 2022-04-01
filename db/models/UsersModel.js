const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  const Country = require(global.appDir + '/db/models/CountriesModel')(sequelize);
  const Language = require(global.appDir + '/db/models/LanguagesModel')(sequelize);
  const Timezone = require(global.appDir + '/db/models/TimezonesModel')(sequelize);
  const Currency = require(global.appDir + '/db/models/CurrenciesModel')(sequelize);
  const User = sequelize.define("user", {
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    social_profile_id: {
      type: Sequelize.STRING(50),
      defaultValue: null
    },
    login_type: {
      type: Sequelize.ENUM("normal", "facebook", "google"),
      defaultValue: "normal"
    },
    profile_pic_url: Sequelize.STRING(255),
    display_name: Sequelize.STRING(50),
    first_name: Sequelize.STRING(50),
    last_name: Sequelize.STRING(50),
    company_name: Sequelize.STRING(50),
    company_site: Sequelize.STRING(50),
    email_id: {
      type: Sequelize.STRING(50),
      allowNull: false,
      primaryKey: true,
      unique: true
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
    customer_since: {
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
      type: Sequelize.ENUM("user", "admin"),
      defaultValue: "user"
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
    token_enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    created_by: Sequelize.STRING(12),
    updated_by: Sequelize.STRING(12),
    modification_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: Sequelize.STRING(20),
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
    },
    booster: {
      type: Sequelize.ENUM("active", "inactive", "pending", "rejected"),
      defaultValue: "inactive"
    },
  },{
    indexes: [
      {
        unique: true,
        fields: ['email_id']
      }
    ]
  });
  return User;
}

