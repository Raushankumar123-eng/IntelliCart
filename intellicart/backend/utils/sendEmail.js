const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: process.env.SENDGRID_FROM_EMAIL, // ✅ FIXED
    templateId: options.templateId,
    dynamicTemplateData: options.data,     // ✅ correct key
  };

  try {
    await sgMail.send(msg);
    console.log("Email successfully sent");
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;


