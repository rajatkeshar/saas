const _           = require('lodash');
const bcrypt      = require('bcrypt');
const Promise     = require('bluebird');
const OTP         = require('otp-generator');
const dbModels    = appGlobals.dbModels;
const modelName   = "users";
const appConfig   = config.get('app');
const jwtsecret   = appConfig.jwtsecret;
const jwtexpiry   = appConfig.jwtexpiry;
const utils       = require(global.appDir + '/utils/jwtutil');
const BaseService = require(global.appDir + '/api/services/BaseService.js');
const MailService = require(global.appDir + '/api/services/MailService.js');
const saltRounds = 10;

class UsersService extends BaseService {

    async registerUsers(reqBody){
        try {
            reqBody.active = false;
            reqBody.password = await bcrypt.hashSync(reqBody.password, bcrypt.genSaltSync(saltRounds));
            let dbModel = await dbModels.getModelInstance(modelName);
            let dbModelOTP = await dbModels.getModelInstance('otps');
            let otpDetails = await dbModelOTP.findOne({ where: { visitor_email: reqBody.email_id } });
            let otp = OTP.generate(6, { digits: true, alphabets: false, specialChars: false });
            let _serviceInst = MailService.getInst();
            let subject = "Please confirm your Email account";
            let html = "Hi, " + "\n OTP: " + otp;
            let text = "";
            
            let user = await dbModel.findOne({ where: { email_id: reqBody.email_id }, attributes: ['active'] });
            if(user && user.active) {
                return Promise.resolve({success: false, message: "user already exists"});
            } else if(user && !user.active ) {
                if(new Date() < new Date(new Date(otpDetails.updatedAt).getTime() + 2 * 60 * 60 * 1000)) {
                    otp = otpDetails.otp;
                    html = "Hi, " + "\n OTP: " + otp;
                    _serviceInst.sendEmail(reqBody.email_id, subject, text, html);
                    return Promise.resolve({success: true, message: "registration successful, Please confirm your Email account"});
                }
            }
            await dbModel.upsert(reqBody, {email_id: reqBody.email_id});
            await dbModelOTP.upsert({otp: otp, is_verified: false, visitor_email: reqBody.email_id}, {visitor_email: reqBody.email_id });
            _serviceInst.sendEmail(reqBody.email_id, subject, text, html);
            return Promise.resolve({success: true, message: "registration successful, Please confirm your Email account"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async verifyUsers(otp, emailId){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { email_id: emailId }, attributes: ['active'] });
            if(user && user.active) {
                return Promise.resolve({success: false, message: "user already active"});
            }
            let dbModelOTP = await dbModels.getModelInstance('otps');
            let otpDetails = await dbModelOTP.findOne({ where: { otp: otp, visitor_email: emailId } });
            if(!otpDetails || otpDetails.is_verified) {
                return Promise.resolve({success: false, message: "invalid otp"});
            }
            if(new Date() > new Date(new Date(otpDetails.updatedAt).getTime() + 2 * 60 * 60 * 1000)) {
                return Promise.resolve({success: false, message: "otp expired"});
            }
            if(otpDetails.otp === otp) {
                await dbModel.update({active: true}, { where: { email_id: emailId} });
                const subject = "Account Activated";
                const html = "Hi, " + "\n Congratulations Your Email Verified Successfully ";
                const text = "";
                let _serviceInst = MailService.getInst();
                _serviceInst.sendEmail(emailId, subject, text, html);
                await dbModelOTP.update({is_verified: true}, { where: { otp: otp, visitor_email: emailId }});
                return Promise.resolve({success:true, message: "account activated"});
            } else {
                return Promise.resolve({success: false, message: "invalid otp"});
            } 
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async login(reqBody){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { email_id: reqBody.email_id } });
            if(!user) {
                return Promise.resolve({success: false, message: "user not found"});
            }
            if(!user.active) {
                return Promise.resolve({success: false, message: "inactive user"});
            }
            if(bcrypt.compareSync(reqBody.password, user.password)) {
                user = JSON.parse(JSON.stringify(user));
                delete user.password;
                let data = {
                    email_id: user.email_id,
                    user_id: user.user_id,
                    user_role: user.user_role,
                    user_name: user.user_name
                }
                const jwt = await utils.jwtsign(data, jwtsecret, { expiresInMinutes: jwtexpiry });
                return Promise.resolve({success: true, message: "login successful", data: user, token: jwt});
            } else {
                return Promise.resolve({success: false, message: "login failed, incorrect password", data: null});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async updateUser(userId, reqBody){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { user_id: userId}, attributes: ['user_id'] });
            
            if (user) {
                await dbModel.update(reqBody, { where: { user_id: userId} });
                return Promise.resolve({success:true, message: "user updated"});
            } else {
                return Promise.resolve({success:false, message: "user not found"});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message}); 
        }
    }

    async getUser(userId) {
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { user_id: userId } });
            user = JSON.parse(JSON.stringify(user));
            delete user.password;
            return Promise.resolve({success: true, message: "user info", data: user});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async getUserInfo(userId) {
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { user_id: userId }, attributes: ['user_id', 'display_name', 'first_name', 'last_name', 'company_name', 'company_site', 'email_id', 'user_role'] });
            user = JSON.parse(JSON.stringify(user));
            delete user.password;
            return Promise.resolve({success: true, message: "user info", data: user});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async forgetPassword(emailId){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { email_id: emailId }, attributes: ['user_id'] });
            if(user) {
                const otp = OTP.generate(6, { digits: true, alphabets: false, specialChars: false });
                const subject = "Forget Password";
                const html = "Hi, " + "\n OTP: " + otp;
                const text = "";
                let _serviceInst = MailService.getInst();
                let dbModelOTP = await dbModels.getModelInstance('otps');
                await dbModelOTP.upsert({otp: otp, is_verified: false, visitor_email: emailId}, {visitor_email: emailId });
                _serviceInst.sendEmail(emailId, subject, text, html);
                return Promise.resolve({success:true, message: "please check email"});
            } else {
                return Promise.resolve({success:false, message: "user not found"}); 
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async confirmPassword(otp, emailId, password){
        try {
            let dbModelOTP = await dbModels.getModelInstance('otps');
            let otpDetails = await dbModelOTP.findOne({ where: { otp: otp, visitor_email: emailId } });
            if(!otpDetails || otpDetails.is_verified) {
                return Promise.resolve({success: false, message: "invalid otp"});
            }
            if(new Date() > new Date(new Date(otpDetails.updatedAt).getTime() + 2 * 60 * 60 * 1000)) {
                return Promise.resolve({success: false, message: "otp expired"});
            }
            if(otpDetails.otp === otp) {
                let dbModel = await dbModels.getModelInstance(modelName);
                password = await bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
                await dbModel.update({password: password}, { where: { email_id: emailId} });
                const subject = "Confirm Password";
                const html = "Hi, " + "\n Your Password Has Been Changed Successfully ";
                const text = "";
                let _serviceInst = MailService.getInst();
                _serviceInst.sendEmail(emailId, subject, text, html);
                await dbModelOTP.update({is_verified: true}, { where: { otp: otp, visitor_email: emailId }});
                return Promise.resolve({success:true, message: "password changed successfully"});
            } else {
                return Promise.resolve({success: false, message: "invalid otp"});
            } 
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async resendOtp(emailId){
        try {
            let dbModelOTP = await dbModels.getModelInstance('otps');
            const otp = OTP.generate(6, { digits: true, alphabets: false, specialChars: false });
            const subject = "Resend OTP";
            const html = "Hi, " + "\n OTP: " + otp;
            const text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(emailId, subject, text, html);
            await dbModelOTP.upsert({otp: otp, is_verified: false, visitor_email: emailId}, {visitor_email: emailId });
            return Promise.resolve({success:true, message: "resend otp"});       
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async resetPassword(email_id, old_password, new_password){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { email_id: email_id }, attributes: ['password'] });
            if(bcrypt.compareSync(old_password, user.password)) {
                new_password = await bcrypt.hashSync(new_password, bcrypt.genSaltSync(saltRounds));
                await dbModel.update({password: new_password}, { where: { email_id: email_id} });
                const subject = "Reset Password";
                const html = "Hi, " + "\n Your Password Has Been Changed Successfully ";
                const text = "";
                let _serviceInst = MailService.getInst();
                _serviceInst.sendEmail(email_id, subject, text, html);
                return Promise.resolve({success: true, message: "password reset successful"});
            } else {
                return Promise.resolve({success: false, message: "incorrect old password", data: null});
            }
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }

    async requestForBooster(email_id){
        try {
            let dbModel = await dbModels.getModelInstance(modelName);
            let user = await dbModel.findOne({ where: { email_id: email_id }, attributes: ['booster'] });
            if(user.booster === "pending") {
                return Promise.resolve({success: false, message: "already requested", data: null});
            }
            await dbModel.update({booster: "pending"}, { where: { email_id: email_id} });
            let subject = "Requeted For Booster";
            let html = "Hi, " + "\n Your Request Has Been Sent To Admin We Will Get Back To You Soon. Thanks";
            let text = "";
            let _serviceInst = MailService.getInst();
            _serviceInst.sendEmail(email_id, subject, text, html);
            let getAdminUsers = await dbModel.findAll({ where: { user_role: "admin" }, attributes: ['email_id'] });
            let getAdminMailId = getAdminUsers.map((a) => {return a.email_id});
            if(getAdminMailId.length) {
                let subject = "New Request For Booster";
                let html = "Hi, " + "\n Your Got A New Request For Booster.";
                let text = "";
                _serviceInst.sendEmail(getAdminMailId, subject, text, html);
            }
            return Promise.resolve({success: true, message: "request successful for booster"});
        } catch (error) {
            return Promise.reject({success: false, message: error.message});
        }
    }
};

module.exports = {
    getInst : function (){
        return new UsersService();
    }
};
