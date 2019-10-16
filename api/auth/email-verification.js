const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  sendVerificationEmail
};

async function sendVerificationEmail(to, token) {
  const msg = {
    to,
    from: 'no-reply@relaylist.com',
    subject: 'Verify your email',
    html: `<p><a>http://localhost:3000/verify-check?${token}</a></p>`
  };
  try {
    const sent = await sgMail.send(msg);
    if (sent) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
