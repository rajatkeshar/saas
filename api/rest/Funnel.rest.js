const FunnelService     = require(global.appDir + '/api/services/FunnelService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/funnel',function (req, res) {
    if(!req.body.template_id) {
        return errorHandler({success: false, message: "missing params #template_id"}, req, res);
    }
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.createFunnel(req.body, req.authInfo));
  })

  app.get('/api/funnel',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 10;
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.getFunels(req.query.offset, req.query.limit, req.authInfo));
  })

  app.get('/api/funnel/:id',function (req, res) {
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.getFunnelById(req.params.id, req.authInfo));
  })

  app.put('/api/funnel/:id',function (req, res) {
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.updateFunnel(req.params.id, req.body, req.authInfo));
  })

  app.put('/api/funnel/publish/:id',function (req, res) {
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.updateFunnelStatus(req.params.id, req.authInfo));
  })

  app.delete('/api/funnel/:id',function (req, res) {
    let _serviceInst = FunnelService.getInst();
    serviceHandler(req, res, _serviceInst.deleteFunnel(req.params.id, req.authInfo));
  })
}
