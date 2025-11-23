import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailer: MailerService) {}

  async sendTestEmail(to: string) {
    try {
      await this.mailer.sendMail({
        to,
        subject: 'Hello from NestJS + Mailpit 👋',
        html: `
              <h2>Halo 👋</h2>
              <p>Email ini dikirim dari NestJS menggunakan Mailpit.</p>
            `,
        text: 'Halo, ini email plain text.',
      });

      this.logger.log(`Test email sent to: ${to}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed sendTestEmail → ${err.message}`);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.mailer.sendMail({
        to,
        subject: 'Welcome to Our Service!',
        html: `
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for joining our service. We're excited to have you on board!</p>
            `,
        text: `Welcome, ${name}! Thank you for joining our service. We're excited to have you on board!`,
      });

      this.logger.log(`Welcome email sent to: ${to}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed sendWelcomeEmail → ${err.message}`);
      return false;
    }
  }
}
