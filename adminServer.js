const path = require('path');
global.appDir = path.dirname(require.main.filename);
const bootstrap = require(global.appDir + '/bootstrap.js');
const config = require(global.appDir + '/config');
bootstrap.init(config);

process.env.APP = process.env.APP || "admin";
process.env.API_PORT = process.env.API_PORT || "3000";

const app = require(global.appDir + "/api");

module.exports = app.start();