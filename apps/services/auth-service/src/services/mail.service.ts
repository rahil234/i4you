import { injectable } from 'inversify';
import { mailTransporter } from '@/config/mail.config';
import { SendMailOptions } from 'nodemailer';
import { IMailService } from '@/services/interfaces/IMailService';

@injectable()
export class MailService implements IMailService {
  async sendMail({ to, subject, html }: SendMailOptions) {
    await mailTransporter.sendMail({
      from: '"I4You" <noreply@i4you.app>',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} with subject "${subject}" successfully.`);
  }
}
