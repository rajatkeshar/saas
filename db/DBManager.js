'use strict';

const fs       = require('fs');
const path     = require('path');
const _        = require('lodash');
const debug    = require('debug');
const BlueBird = require('bluebird');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

class DBManager {

    constructor(config){
        this.name     = config.name || 'dbmanager';
        this.debug    = debug('dbmanager');
        this.db       = config.db;
    }

    init(){
        return new BlueBird( async (resolve, reject) => {
            console.info(this.name + ' : initialization in progress');
            const connection = await mysql.createConnection({ host: this.db.host, port: this.db.port, user: this.db.userName, password: this.db.password });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${this.db.database}\`;`);

            // connect to db
            const sequelize = new Sequelize(this.db.database, this.db.userName, this.db.password, { 
                dialect: this.db.dialect, 
                pool: this.db.pool
            });

            this.sequelize = sequelize;
            resolve(sequelize);
        });
    }
}

module.exports = DBManager;
