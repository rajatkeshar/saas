const OrderService     = require(global.appDir + '/api/services/OrderService');
const errorHandler  = require(global.appDir + '/api/serviceHandler.js').errorHandler;
const serviceHandler  = require(global.appDir + '/api/serviceHandler.js').serviceHandler;
module.exports.init = function (app) {

  app.post('/api/orders',function (req, res) {
    let _serviceInst = OrderService.getInst();
    serviceHandler(req, res, _serviceInst.createOrder(req.body, req.authInfo));
  })

  app.get('/api/orders',function (req, res) {
    let _serviceInst = OrderService.getInst();
    serviceHandler(req, res, _serviceInst.getOrders(req.authInfo));
  })

  app.get('/api/orders/:order_id',function (req, res) {
    let _serviceInst = OrderService.getInst();
    serviceHandler(req, res, _serviceInst.getOrderById(req.params.order_id, req.authInfo));
  })

  app.get('/api/orders/:order_id/payments',function (req, res) {
    let _serviceInst = OrderService.getInst();
    serviceHandler(req, res, _serviceInst.getPaymentsOrderById(req.params.order_id, req.authInfo));
  })
}
