const nodemailer = require('nodemailer');

/**
 * Class: Email to send emails
 */
class Email {

    constructor(config) {
        this.createTransport = nodemailer.createTransport(config);
    }

    sendEmail(email) {
        try {
            this.createTransport.sendMail(email, function(error, info) {
                if (error) {
                    console.info('Error al enviar el email' + error);
                } else {
                    console.info('Email enviado con exito');
                    console.info('Message sent: %s', info.messageId);
                    console.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                }

                this.createTransport.close();
            });

        } catch (err) {
            console.info(err);
        }
    }

}

module.exports = Email;