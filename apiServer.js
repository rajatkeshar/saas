const path = require('path');
global.appDir = path.dirname(require.main.filename);
const bootstrap = require(global.appDir + '/bootstrap.js');
const config = require(global.appDir + '/config');
bootstrap.init(config);

const app = require(global.appDir + "/api")

module.exports = app.start();
