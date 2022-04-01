const LanguageService     = require(global.appDir + '/api/services/LanguageService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/languages',function (req, res) {
    let _serviceInst = LanguageService.getInst();
    serviceHandler(req, res, _serviceInst.getLanguages());
  })
}
