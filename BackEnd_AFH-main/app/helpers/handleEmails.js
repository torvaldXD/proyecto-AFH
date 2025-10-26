const nodemailer = require('nodemailer');

/**
 * Class: Email to send emails
 */
class Email {

    constructor(config) {
        this.transporter = nodemailer.createTransport(config);
    }

    sendEmail(email) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(email, (error, info) => {
                if (error) {
                    console.error('❌ Error al enviar el email:', error);
                    reject(error);
                } else {
                    console.log('✅ Email enviado con éxito:', info.messageId);
                    console.log('📧 Destinatario:', email.to);
                    resolve(info);
                }
                // NO cerrar la conexión aquí - se reutiliza
            });
        });
    }

}

module.exports = Email;