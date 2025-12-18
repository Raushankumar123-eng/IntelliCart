const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ email, templateId, data }) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // must be verified
    templateId: templateId,
    dynamicTemplateData: data, // 👈 EXACT key
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "SendGrid Error:",
      error.response?.body || error.message
    );
    throw new Error("Failed to send reset password email");
  }
};

module.exports = sendEmail;
