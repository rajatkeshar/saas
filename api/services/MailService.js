const nodemailer = require('nodemailer');
const mailConfig = config.get('mail');
const BaseService = require(global.appDir + '/api/services/BaseService.js');

var transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: true, // use SSL
        auth: {
            user: mailConfig.email,
            pass: mailConfig.password
        }
});

class MailService extends BaseService {
    async sendEmail(email, subject, text, html) {
        return await transporter.sendMail({
            from: '"FunnelBaba" <no-reply@funnelbaba.io>',
            to: email,
            subject: subject,
            text: text,
            html: html
        });
    }
}

module.exports = {
    getInst : function (){
        return new MailService();
    }
};

