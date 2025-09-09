export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface IMailService {
  sendMail({ to, subject, html }: SendMailOptions): Promise<void>;
}
