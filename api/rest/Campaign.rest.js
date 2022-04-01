const CampaignService     = require(global.appDir + '/api/services/CampaignService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/campaign',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.createCampaign(req.body, req.authInfo));
  })

  app.get('/api/campaign',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaigns(req.query, req.authInfo));
  })

  app.get('/api/campaign/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaignById(req.params.id, req.authInfo));
  })

  app.put('/api/campaign/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.updateCampaign(req.params.id, req.body, req.authInfo));
  })

  app.put('/api/campaign/publish/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.updateCampaignStatus(req.params.id, req.authInfo));
  })

  app.delete('/api/campaign/:id',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.deleteCampaign(req.params.id, req.authInfo));
  })

  app.get('/api/campaign/open/uuid',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaignUuid(req.query, req.authInfo));
  })

  app.get('/api/campaign/:username/public/uuid/:uuid',function (req, res) {
    let _serviceInst = CampaignService.getInst();
    serviceHandler(req, res, _serviceInst.getCampaignByUuid(req.params.uuid, req.params.username));
  })
}
