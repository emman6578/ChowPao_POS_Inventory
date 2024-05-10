import nodemailer from "nodemailer";

export async function sendEmail(data: any) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  let info = await transporter.sendMail({
    from: {
      name: "Twitter clone",
      address: "Twitter clone login code",
    },
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });
}
