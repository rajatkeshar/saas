const passport = require('passport');
const AuthService     = require(global.appDir + '/api/services/AuthService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

  app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    let _serviceInst = AuthService.getInst();
    serviceHandler(req, res, _serviceInst.login(req.user));
  })

  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    let _serviceInst = AuthService.getInst();
    serviceHandler(req, res, _serviceInst.login(req.user));
  });

  app.get('/api/auth/facebook/token', passport.authenticate('facebook-token'), function (req, res) {
    let _serviceInst = AuthService.getInst();
    serviceHandler(req, res, _serviceInst.login(req.user));
  });

  app.get('/api/auth/google/token', passport.authenticate('google-token'), function(req, res) {
    let _serviceInst = AuthService.getInst();
    serviceHandler(req, res, _serviceInst.login(req.user));
  });
}
