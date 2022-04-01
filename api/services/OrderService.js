const _             = require('lodash');
const Promise       = require('bluebird');
const dbModels      = appGlobals.dbModels;
const modelName     = "orders";
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

class OrdersService extends BaseService {

    async createOrder(reqBody, authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let orders = await this.Razorpay.orders.create(reqBody);
            orders.order_id = orders.id;
            orders.user_ref_id = authInfo.user_id;
            let data = await dbModel.create(orders);
            return Promise.resolve({success: true, message: "order created", data: data});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getOrders(authInfo){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let orders = await dbModel.findAll({ where: {user_ref_id: authInfo.user_id} });
            return Promise.resolve({success:true, message: "orders details", data: orders});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getOrderById(order_id, authInfo){
        try {
            let order = await this.Razorpay.orders.fetch(order_id);
            return Promise.resolve({success:true, message: "order details", data: order});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getPaymentsOrderById(order_id, authInfo){
        try {
            let payments = await this.Razorpay.orders.fetchPayments(order_id);
            return Promise.resolve({success:true, message: "payments details", data: payments});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new OrdersService();
    }
};
