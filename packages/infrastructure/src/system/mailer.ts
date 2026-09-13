import type { Mailer } from "@dayone/ports";
export class ConsoleMailer implements Mailer {
  async send(to: string, subject: string, text: string): Promise<void> { console.log(`[mail] to=${to} subject=${subject}\n${text}`); }
}
