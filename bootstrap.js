var debug   = require("debug");
var cache   = require('memory-cache');

var debug;
var globals = {};

globals.config = function(_config) {
    Object.defineProperty(global, 'config', {
        value: _config,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

globals.cache = function() {
    Object.defineProperty(global, 'cache', {
        value: cache,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

globals.appGlobals = function() {
    Object.defineProperty(global, 'appGlobals', {
        value: {},
        writable: true,
        configurable: false,
        enumerable: true
    });
};


globals.dbModels = function() {
    var modelsInst = require('./db/models');
    Object.defineProperty(appGlobals, 'dbModels', {
        value: modelsInst,
        writable: false,
        configurable: false,
        enumerable: true
    });
};

function initiateDataBase(callback) {
    const dbMgr = require(global.appDir + '/db');
    const db = config.get("db");
    debug("initiating database");
    dbMgr.initialize({db: db})
    .then(function(dbMgr){
        return callback && callback(dbMgr);
    });
}



function prepareGlobalConstants(_globals) {
    if (!debug) debug = require('debug')('bootstrap');

    //global constants load
    var globalConstants = [
        'appGlobals',
        'dbModels'
    ];

    if (arguments.length !== 0) {
        debug('Load all Globals');
        globalConstants = globalConstants.filter(function (i) {
            return (_globals.indexOf(i) > -1);
        });
    }

    globalConstants.forEach(function(constant) {
        if (global.constant) return;
        debug('loading constant', constant);
        globals[constant]();
    });
}

function essentials(conf){
    //so we can enable debug from config
    //require('./bootstrap.debug.js')(conf);
    debug       = require('debug')('bootstrap');
    globals.config(conf);
    globals.cache();
}


exports.init = async function(conf) {
    essentials(conf)
    prepareGlobalConstants();
    initiateDataBase();
};

exports.globals = globals;