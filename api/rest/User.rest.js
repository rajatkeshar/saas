const UserService     = require(global.appDir + '/api/services/UserService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/users/register',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.registerUsers(req.body));
  })

  app.post('/api/users/verify',function (req, res) {
    if(!req.body.email_id) {
      return errorHandler({success: false, message: "missing params #email_id"}, req, res);
    }
    if(!req.body.otp) {
      return errorHandler({success: false, message: "missing params #otp"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.verifyUsers(req.body.otp, req.body.email_id));
  })

  app.post('/api/users/login',function (req, res) {
    if(!req.body.email_id) {
      return errorHandler({success: false, message: "missing params #email_Id"}, req, res);
    }
    if(!req.body.password) {
      return errorHandler({success: false, message: "missing params #password"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.login(req.body));
  })

  app.put('/api/users/:id',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.updateUser(req.params.id, req.body));
  })

  app.get('/api/users/:id',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.getUser(req.params.id));
  })

  app.get('/api/users/info/get',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.getUserInfo(req.authInfo.user_id));
  })

  app.post('/api/users/forgetPassword',function (req, res) {
    if(!req.body.email_id) {
      return errorHandler({success: false, message: "missing params #email_Id"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.forgetPassword(req.body.email_id));
  })

  app.post('/api/users/confirmPassword',function (req, res) {
    if(!req.body.email_id) {
      return errorHandler({success: false, message: "missing params #email_id"}, req, res);
    }
    if(!req.body.new_password) {
      return errorHandler({success: false, message: "missing params #new_password"}, req, res);
    }
    if(!req.body.otp) {
      return errorHandler({success: false, message: "missing params #otp"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.confirmPassword(req.body.otp, req.body.email_id, req.body.new_password));
  })

  app.post('/api/users/resendOtp',function (req, res) {
    if(!req.body.email_id) {
      return errorHandler({success: false, message: "missing params #email_id"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.resendOtp(req.body.email_id));
  })

  app.post('/api/users/resetPassword',function (req, res) {
    if(!req.body.old_password) {
      return errorHandler({success: false, message: "missing params #old_password"}, req, res);
    }
    if(!req.body.new_password) {
      return errorHandler({success: false, message: "missing params #new_password"}, req, res);
    }
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.resetPassword(req.authInfo.email_id, req.body.old_password, req.body.new_password));
  })

  app.post('/api/users/booster/request',function (req, res) {
    let _serviceInst = UserService.getInst();
    serviceHandler(req, res, _serviceInst.requestForBooster(req.authInfo.email_id));
  })
}
