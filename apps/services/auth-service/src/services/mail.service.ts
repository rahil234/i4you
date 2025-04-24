import { injectable } from 'inversify';
import { mailTransporter } from '@/config/mail.config';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@injectable()
export class MailService {
  async sendMail({ to, subject, html }: SendMailOptions) {
    await mailTransporter.sendMail({
      from: '"I4You" <noreply@i4you.app>',
      to,
      subject,
      html,
    });
  }
}
