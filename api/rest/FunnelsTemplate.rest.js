const TemplateService     = require(global.appDir + '/api/services/FunnelsTemplateService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/template',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 2;
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.getTemplates(req.query.offset, req.query.limit));
  })

  app.get('/api/template/:id',function (req, res) {
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.getTemplateById(req.params.id));
  })
}
