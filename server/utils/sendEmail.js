import nodemailer from 'nodemailer';
import 'dotenv/config'

const sendEmail = async(barrel, comments) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });
  const mailOptions = {
    from: '"bbbt.damagereview"',
    to: 'emilyrachelstickler@gmail.com',
    subject: 'Damage Review Requested',
    html: `
      <p><b>Barrel #${barrel.number}</b></p>
      <p><b>Customer: </b>${barrel.open.customer}</p>
      <p><b>Invoice: </b>${barrel.open.invoice}</p>
      ${ !comments ? "" : `<p><b>Comments: </b>${comments}</p>`} 
    `
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("email sent - ", result.response);
    return true
  } catch(e) {
    console.log(e);
    return false
  }
}

export default sendEmail