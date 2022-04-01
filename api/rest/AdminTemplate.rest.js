const TemplateService     = require(global.appDir + '/api/services/AdminTemplateService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/adminapi/template',function (req, res) {
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.createTemplate(req.body, req.authInfo));
  })

  app.get('/adminapi/template',function (req, res) {
    req.query.offset = parseInt(req.query.offset) || 0;
    req.query.limit = parseInt(req.query.limit) || 2;
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.getTemplates(req.query.offset, req.query.limit));
  })

  app.get('/adminapi/template/:id',function (req, res) {
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.getTemplateById(req.params.id));
  })

  app.put('/adminapi/template/:id',function (req, res) {
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.updateTemplate(req.params.id, req.body, req.authInfo));
  })

  app.delete('/adminapi/template/:id',function (req, res) {
    let _serviceInst = TemplateService.getInst();
    serviceHandler(req, res, _serviceInst.deleteTemplate(req.params.id, req.authInfo));
  })
}
