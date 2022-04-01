const UploadService     = require(global.appDir + '/api/services/UploadService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/upload/content/type/:type/id/:id',function (req, res) {
    if(!req.params.type) {
        return errorHandler({success: false, message: "missing params #type"}, req, res);
    }
    let _serviceInst = UploadService.getInst();
    serviceHandler(req, res, _serviceInst.uploadContent(req, res));
  })
}
