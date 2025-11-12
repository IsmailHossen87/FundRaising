import { ISendEmail } from '../types/email';

interface IRaffleWinnerEmail {
  name: string;
  raffleName?: string;
  ticketCodes?: string[];
  drawDate?: Date | null;
  message?: string;
}

export const notificationEmailTemplates = {
  // Generic notification
  genericNotification: (name: string, message: string): ISendEmail => ({
    to: '', // dynamically set
    subject: '📢 New Notification',
    html: `
      <body style="font-family: Arial, sans-serif; background:#f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
          <div style="background:#4caf50; color:#fff; text-align:center; padding:20px;">
            <h1 style="margin:0; font-size:22px;">Hello ${name}</h1>
          </div>
          <div style="padding:30px; color:#555;">
            <p>${message}</p>
          </div>
          <div style="background:#f0f2f5; text-align:center; padding:15px; font-size:12px; color:#888;">
            © ${new Date().getFullYear()} FundRaise. All rights reserved.
          </div>
        </div>
      </body>
    `,
  }),

  // Winner email notification
  raffleWinner: (values: IRaffleWinnerEmail): ISendEmail => {
    return {
      to: '',
      subject: `🎉 Congratulations ${values.name}! You won the raffle!`,
      html: `
        <div style="font-family:Arial,sans-serif; padding:20px; background:#f4f4f4;">
          <h2>Congratulations ${values.name}!</h2>
          <p>You are a <strong>winner</strong> in the raffle${
            values.raffleName ? `: <strong>${values.raffleName}</strong>` : ''
          }.</p>
          ${values.message ? `<p>${values.message}</p>` : ''}
          <p>Keep an eye on your email for further prize details!</p>
          <p>— FundRaise Team 💚</p>
        </div>
      `,
    };
  },
};
