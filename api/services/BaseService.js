const Promise = require('bluebird');
const Razorpay = require("razorpay");
const RazorpayConfig = config.get('razorpay');



function BaseService() {
    this.Razorpay = new Razorpay({
        key_id: RazorpayConfig.key,
        key_secret: RazorpayConfig.secret
    })
}

BaseService.prototype.parseJSON = function(string) {
    try {
        return JSON.parse(string) || {};
    } catch (e) {
        return string;
    }
};

BaseService.prototype.toJSON = function(string){
    return this.parseJSON(JSON.stringify(string));
}

module.exports = BaseService;
