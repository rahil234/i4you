import nodemailer from 'nodemailer';

export const mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rahilsardar234@gmail.com',
    pass: 'vkuq ysrb rrzu qyxz',
  },
});
