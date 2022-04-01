const CurrenciesService     = require(global.appDir + '/api/services/CurrenciesService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/currencies',function (req, res) {
    let _serviceInst = CurrenciesService.getInst();
    serviceHandler(req, res, _serviceInst.getCurrencies());
  })
}
