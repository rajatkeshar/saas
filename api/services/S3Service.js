const _             = require('lodash');
const Promise       = require('bluebird');
const AWS           = require('aws-sdk');
const fs            = Promise.promisifyAll(require('fs'));
const awsDetails    = config.get('awsDetails');
const bucketName    = awsDetails.bucket;
const BaseService   = require(global.appDir + '/api/services/BaseService.js');

AWS.config.update({
  accessKeyId: awsDetails.key,
  secretAccessKey: awsDetails.secret
});

const deleteLocalFile = function(local_path) {
    try {
        fs.unlinkSync(local_path);
    } catch (error) {
        console.warn(`fs_unlink_failed:${local_path}`);
    }
}

class S3Service extends BaseService {
    
    async uploadToS3Bucket(localFilePath, content) {
        console.log("localFilePath: ", localFilePath);
        console.log("content: ", content);
        var imgbuffer = fs.readFileSync(localFilePath)
        var s3bucket = new AWS.S3({ Bucket: bucketName })
        var objectParams = { 
            Bucket: bucketName, 
            Key:  content,
            Body: imgbuffer, 
            ACL: "public-read" 
        };
        deleteLocalFile(localFilePath);
        console.log("TRYING UPLOAD::", objectParams);
        return s3bucket.upload(objectParams).promise();
    }
};

module.exports = {
    getInst : function (){
        return new S3Service();
    }
};
