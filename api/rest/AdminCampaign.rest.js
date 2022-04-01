const CampaignService     = require(global.appDir + '/api/services/AdminCampaignService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/adminapi/campaign',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 10;
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaigns(req.query.offset, req.query.limit, req.query.status));
  })

  app.get('/adminapi/campaign/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaignById(req.params.id));
  })

  app.put('/adminapi/campaign/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.updateCampaign(req.params.id, req.body, req.authInfo));
  })
}
