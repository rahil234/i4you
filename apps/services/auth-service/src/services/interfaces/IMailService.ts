import { SendMailOptions } from 'nodemailer';

export interface IMailService {
  sendMail({ to, subject, html }: SendMailOptions): Promise<void>;
}
