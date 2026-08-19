import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// mail generator
const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task manager",
      link: "https://taskmanagerlink.com",
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent); //this will give plain text if html not support
  const emailHtml = mailGenerator.generate(options.mailgenContent); //this will give html format mail

  //sending of mail
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });
  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  }
  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("error in sending mail",error)
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to our application! We're very excited to have you on board.",
      action: {
        instructions: "To verify your registered email, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your email account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// To reset password we send email verification
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a password reset request from your account.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#e2790f", // Optional action button color
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { forgotPasswordMailgenContent, emailVerificationMailgenContent ,sendEmail};
