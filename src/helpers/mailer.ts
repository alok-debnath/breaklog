import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const sendEmail = async ({ email, emailType, userID }: any) => {
  try {
    // create hashed token
    const hashedToken = await bcryptjs.hash(userID.toString(), 10);

    if (emailType === 'VERIFY') {
      await prisma.user.update({
        where: { id: userID },
        data: {
          verify_token: hashedToken,
          verify_token_expiry: (Date.now() + 3600000).toString(),
        },
      });
    } else if (emailType === 'RESET') {
      await prisma.user.update({
        where: { id: userID },
        data: {
          forgot_password_token: hashedToken,
          forgot_password_token_expiry: (Date.now() + 3600000).toString(),
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.PERSONAL_MAIL,
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<h1>Click the link below to verify your email</h1><a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">"${
        emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password'
      }"</a>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
