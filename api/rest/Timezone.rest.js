const TimezoneService     = require(global.appDir + '/api/services/TimezoneService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/timezones',function (req, res) {
    let _serviceInst = TimezoneService.getInst();
    serviceHandler(req, res, _serviceInst.getTimezones());
  })
}
