const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ email, templateId, data }) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // verified sender
    templateId,
    dynamicTemplateData: data, // 👈 MUST be this key
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
