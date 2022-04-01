const IndustriesService     = require(global.appDir + '/api/services/IndustriesService');
const serviceHandler        = require(global.appDir + '/api/serviceHandler.js').serviceHandler;

module.exports.init = function (app) {

  app.get('/api/industries',function (req, res) {
    let _serviceInst = IndustriesService.getInst();
    serviceHandler(req, res, _serviceInst.getIndustries());
  })
}
