import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Ecobazar" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};


// import nodemailer from "nodemailer";

// export const sendEmail = async ({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) => {
//   // ✅ Use SendGrid SMTP
//   const transporter = nodemailer.createTransport({
//     host: "smtp.sendgrid.net",
//     port: 587,
//     auth: {
//       user: "apikey", // <-- literally the word "apikey"
//       pass: process.env.SENDGRID_API_KEY, // your actual API key from SendGrid
//     },
//   });

//   const mailOptions = {
//     from: `"Ecobazar" <no-reply@ecobazar.com>`, // ✅ Use a domain-verified email
//     to,
//     subject,
//     html,
//   };

//   await transporter.sendMail(mailOptions);
// };
