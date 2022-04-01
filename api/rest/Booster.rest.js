const BoosterService     = require(global.appDir + '/api/services/BoosterService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/booster',function (req, res) {
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.createBooster(req.body, req.authInfo));
  })

  app.get('/api/booster',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 2;
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.getBoosters(req.query.offset, req.query.limit, req.authInfo));
  })

  app.get('/api/booster/:id',function (req, res) {
    if(!req.params.id) {
        return errorHandler({success: false, message: "missing params #id"}, req, res);
    }
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.getBoosterById(req.params.id, req.authInfo));
  })

  app.put('/api/booster/status/:id',function (req, res) {
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.updateBoosterStatus(req.params.id, req.body.status, req.authInfo));
  })
}
