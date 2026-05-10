import nodemailer from 'nodemailer';
import env from "../config/env.js";

const barrelDamagedEmail = async(barrel, comments, images) => {
  const mailOptions = {
    from: '"bbbt.damagereview"',
    to: env.email.pocEmail,
    subject: 'Damage Review Requested',
    html: `
      <p><b>Barrel #${barrel.number}</b></p>
      <p><b>Customer: </b>${barrel.open.customer}</p>
      <p><b>Invoice: </b>${barrel.open.invoice}</p>
      ${ !comments ? "" : `<p><b>Comments: </b>${comments}</p>`} 
      ${ images ? images.map((img => `<img src="${img.url}" style="width:300px;height:auto" />`)) : "" }
    `
  };
  return await sendEmail(mailOptions)
}

const recoverPinEmail = async(code) => {
  const mailOptions = {
    from: '"Pin Recovery"',
    to: env.email.pocEmail,
    subject: "BB BT Pin Recovery",
    html: `
      <p><b>Code: </b> ${code}</p>
    `
  };
  return await sendEmail(mailOptions);
}

const sendEmail = async(mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.email.user,
      pass: env.email.pass
    }
  });
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("email sent - ", result.response);
    return true
  } catch(e) {
    console.log(e);
    return false
  }
}

export { barrelDamagedEmail, recoverPinEmail }