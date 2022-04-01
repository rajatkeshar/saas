const CountriesService     = require(global.appDir + '/api/services/CountriesService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/countries',function (req, res) {
    let _serviceInst = CountriesService.getInst();
    serviceHandler(req, res, _serviceInst.getCountries());
  })
}
