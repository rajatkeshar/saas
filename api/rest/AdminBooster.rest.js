const BoosterService     = require(global.appDir + '/api/services/AdminBoosterService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/adminapi/booster',function (req, res) {
    if(!req.body.user_ref_id) {
      return errorHandler({success: false, message: "missing params #user_ref_id"}, req, res);
    }
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.createBooster(req.body, req.authInfo));
  })

  app.get('/adminapi/booster',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 2;
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.getBoosters(req.query.offset, req.query.limit, req.authInfo));
  })

  app.get('/adminapi/booster/:id',function (req, res) {
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.getBoosterById(req.params.id, req.authInfo));
  })

  app.put('/adminapi/booster/:id',function (req, res) {
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.updateBooster(req.params.id, req.body, req.authInfo));
  })

  app.put('/adminapi/booster/status/:id',function (req, res) {
    let _serviceInst = BoosterService.getInst();
    serviceHandler(req, res, _serviceInst.updateBoosterStatus(req.params.id, req.body.status, req.authInfo));
  })
}
