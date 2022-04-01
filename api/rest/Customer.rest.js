const CustomerService     = require(global.appDir + '/api/services/CustomerService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/customer/public/campaign/uuid/:campaign_uuid',function (req, res) {
    if(!req.body.email_id) {
        return errorHandler({success: false, message: "missing params #email_id"}, req, res);
    }
    let _serviceInst = CustomerService.getInst();
    serviceHandler(req, res, _serviceInst.createCustomer(req));
  })

  app.get('/api/customer/campaign/uuid/:campaign_uuid',function (req, res) {
    let _serviceInst = CustomerService.getInst();
    serviceHandler(req, res, _serviceInst.getCustomers(req.query, req.params.campaign_uuid, req.authInfo));
  })

  app.get('/api/customer/:id',function (req, res) {
    let _serviceInst = CustomerService.getInst();
    serviceHandler(req, res, _serviceInst.getCustomerById(req.params.id, req.authInfo));
  })
}
