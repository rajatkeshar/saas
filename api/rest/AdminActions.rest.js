const UserService     = require(global.appDir + '/api/services/AdminActionsService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/adminapi/actions/users',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.getUsers(req));
  })
  app.get('/adminapi/actions/users/:id',function (req, res) {
    if(!req.params.id) {
        return errorHandler({success: false, message: "missing params #id"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.getUserInfo(req));
  })
}
