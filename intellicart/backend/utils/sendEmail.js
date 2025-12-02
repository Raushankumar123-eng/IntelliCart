const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {

    const msg = {
        to: options.email,
        from: process.env.SENDGRID_MAIL,
        templateId: options.templateId,
        dynamic_template_data: options.data,
    }

    try {
        await sgMail.send(msg);
        console.log('Email successfully sent');
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = sendEmail;
