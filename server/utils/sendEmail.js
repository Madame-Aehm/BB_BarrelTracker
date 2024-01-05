import nodemailer from 'nodemailer';
import 'dotenv/config'

const sendEmail = (barrel, comments) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });
  const mailOptions = {
    from: "bbbt.damage-review",
    to: 'emilyrachelstickler@gmail.com',
    subject: 'Damage Review Requested',
    html: `
      <p><b>Barrel #${barrel.number}</b></p>
      <p><b>Customer: </b>${barrel.history[0].customer}</p>
      <p><b>Invoice: </b>${barrel.history[0].invoice}</p>
      ${ !comments ? "" : `<p><b>Comments: </b>${comments}</p>`} 
    `
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      return false
    } else {
      console.log('Email sent: ' + info.response);
      return true
    }
  });
}

export default sendEmail