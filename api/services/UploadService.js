const _             = require('lodash');
const Promise       = require('bluebird');
const formidable    = require('formidable');
const fs            = Promise.promisifyAll(require('fs'));
const awsDetails    = config.get('awsDetails');
const utils         = require(global.appDir + '/utils');
const BaseService   = require(global.appDir + '/api/services/BaseService.js');
const FunnelService = require(global.appDir + '/api/services/FunnelService').getInst();
const UserService   = require(global.appDir + '/api/services/UserService.js').getInst();
const S3Service     = require(global.appDir + '/api/services/S3Service').getInst();
const CampaignService = require(global.appDir + '/api/services/CampaignService').getInst();
const fileTypes       = ["video", "image"];
const contentTypes    = ["profile", "funnel", "campaign"];

class UploadService extends BaseService {

    async uploadContent(req, res){
        try {
            return new Promise(async (resolve, reject) => {
                let uploadType = req.params.type;
                if(!contentTypes.includes(uploadType)) {
                    return reject({success: false, message: "invalid content type"});
                }
                let id = req.params.id;
                let contentId = await utils.Content();
                let userId = req.authInfo.user_id;
                let fileType, fileExt, actualFilePath, localFilePath, cloudFilePath;
                let form = new formidable.IncomingForm({ keepExtensions: true });
                form.hash = 'md5';
                form.parse(req)
                
                form.on('fileBegin', (name, file)=> {
                    let fileType = file.type.split("/")[0];
                    let fileExts = file.name.split(".");
                    if(!fileTypes.includes(fileType)) {
                        return reject({success: false, message: "invalid file"});
                    }
                    fileExt  = fileExts[fileExts.length - 1];
                    if(fileType === 'image') {
                        actualFilePath = `${global.appDir}/public/images/${userId}/${uploadType}`;
                    }
                    else if(fileType === 'video') {
                        actualFilePath = `${global.appDir}/public/videos/${userId}/${uploadType}`;
                    }
                    fs.mkdirSync(actualFilePath, { recursive: true });
                    file.path = `${actualFilePath}/${contentId}.${fileExt}`;
                    file.type = fileType;
                    localFilePath = file.path;
                    cloudFilePath = `${userId}/${uploadType}/${contentId}.${fileExt}`;
                });

                form.on('file', function (name, file){
                    if(parseInt(file.size) > parseInt(awsDetails.sizeLimitByBytes)){
                        return reject({success: false, message: "Size Limit Exceeded"});
                    }
                });
            
                form.on('error',(error) => {
                    return reject({success: false, message: error.message});
                });
                
                form.on('end', async () => {
                    let uploadDetail = await S3Service.uploadToS3Bucket(localFilePath, cloudFilePath);
                    console.log("uploadDetail: ", uploadDetail);
                    switch (uploadType) {
                        case "profile":
                            await UserService.updateUser(userId, {profile_pic_url: uploadDetail.Location}, req.authInfo);
                            break;
                        case "funnel": 
                            await FunnelService.updateFunnel(id, {img_urls: uploadDetail.Location}, req.authInfo);
                            break;
                        case "campaign": 
                            await CampaignService.updateCampaign(id, {img_urls: uploadDetail.Location}, req.authInfo);
                            break;
                        default:
                            break;
                    }
                    return resolve({success: true, message: "upload success", data: uploadDetail});
                })
            });
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new UploadService();
    }
};
