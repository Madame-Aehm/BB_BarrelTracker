import nodemailer from 'nodemailer';
import 'dotenv/config'

const barrelDamagedEmail = async(barrel, comments) => {
  const mailOptions = {
    from: '"bbbt.damagereview"',
    to: process.env.POC_EMAIL,
    subject: 'Damage Review Requested',
    html: `
      <p><b>Barrel #${barrel.number}</b></p>
      <p><b>Customer: </b>${barrel.open.customer}</p>
      <p><b>Invoice: </b>${barrel.open.invoice}</p>
      ${ !comments ? "" : `<p><b>Comments: </b>${comments}</p>`} 
    `
  };
  return await sendEmail(mailOptions)
}

const recoverPinEmail = async(code) => {
  const mailOptions = {
    from: '"Pin Recovery"',
    to: process.env.POC_EMAIL,
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
      user: process.env.USER,
      pass: process.env.PASS
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