var _ = require('lodash');

function errorHandler(err, req, res){
    
    var errorResponse = _.pick(err,['success', 'message', 'errors']);
    console.log("Error %s -> %s", req.originalUrl, JSON.stringify(errorResponse));
    //res.status(err.customCode || 500).send(errorResponse);
    res.status(200).send(errorResponse);
}

function serviceHandler(req, res, serviceP) {
    serviceP.then(function(body){
        
        body = _.isEmpty(body) ? {} : body;
        // if(_.isPlainObject(body)){
        //     body.customCode = 200;
        // }
        res.status(200).send(body);   
    }).catch(function(e){
        return errorHandler(e, req, res);
    });
}

module.exports.serviceHandler = serviceHandler;
module.exports.errorHandler = errorHandler;
