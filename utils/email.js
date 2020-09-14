const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `yogesh mishra <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD
        }
      });
    }

    // 1) Create a transporter for development mode
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //SEND THE ACTUAL EMAIL
  async send(template, subject) {
    //1) render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    //DEFINE EMAIL OPTIONS
    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    //3) CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport()
      .sendMail(mailOptions)
      .then(res => console.log('Successfully sent'))
      .catch(err => console.log('Failed ', err));
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to yogi-tour application!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token  (valid for only 10 minutes)!'
    );
  }
};
