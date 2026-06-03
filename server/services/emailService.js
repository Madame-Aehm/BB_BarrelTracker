import nodemailer from "nodemailer";
import env from "../config/env.js";

export default class EmailService {
  constructor(emailConfig = env.email) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    this.pocEmail = emailConfig.pocEmail;
  }

  async send(mailOptions) {
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log("email sent - ", result.response);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async sendDamageReviewEmail(barrel, comments, images) {
    const mailOptions = {
      from: '"bbbt.damagereview"',
      to: this.pocEmail,
      subject: "Damage Review Requested",
      html: `
      <p><b>Barrel #${barrel.number}</b></p>
      <p><b>Customer: </b>${barrel.open.customer}</p>
      <p><b>Invoice: </b>${barrel.open.invoice}</p>
      ${!comments ? "" : `<p><b>Comments: </b>${comments}</p>`}
      ${images ? images.map((img) => `<img src="${img.url}" style="width:300px;height:auto" />`) : ""}
    `,
    };
    return this.send(mailOptions);
  }

  async sendPinRecoveryEmail(code) {
    const mailOptions = {
      from: '"Pin Recovery"',
      to: this.pocEmail,
      subject: "BB BT Pin Recovery",
      html: `
      <p><b>Code: </b> ${code}</p>
    `,
    };
    return this.send(mailOptions);
  }
}
