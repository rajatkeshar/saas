const AdminUploadService     = require(global.appDir + '/api/services/AdminUploadService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/adminapi/upload/content/type/:type',function (req, res) {
    if(!req.params.type) {
        return errorHandler({success: false, message: "missing params #type"}, req, res);
    }
    let _serviceInst = AdminUploadService.getInst();
    serviceHandler(req, res, _serviceInst.uploadContent(req, res));
  })
}
