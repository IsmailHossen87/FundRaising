import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: {
  name: string;
  email: string;
  otp: number;
}) => {
  const data = {
    to: values.email,
    subject: 'Verify Your Fundraising Account 🎉',
    html: `
      <body style="font-family: 'Segoe UI', sans-serif; background: #f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background: #ffffff; border-radius: 15px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #28a745, #85d77f); text-align:center; padding: 30px;">
            <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="width:120px; margin-bottom: 10px;">
            <h1 style="color:#fff; font-size:24px; margin:0;">Welcome, ${
              values.name
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; text-align:center; color:#555;">
            <p style="font-size:16px; line-height:1.6;">Thanks for signing up! Your verification code is:</p>
            <div style="display:inline-block; background:#28a745; color:#fff; font-size:28px; padding:15px 25px; border-radius:10px; letter-spacing:3px; margin:20px 0;">${
              values.otp
            }</div>
            <p style="font-size:14px; color:#888;">This code is valid for 3 minutes.</p>
            <p style="font-size:14px; color:#888;">If you did not request this, you can safely ignore this email.</p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; text-align:center; padding:20px; font-size:12px; color:#aaa;">
            © ${new Date().getFullYear()} FundRaise. All rights reserved.
          </div>
        </div>
      </body>
    `,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: '🔒 Reset Your Password',
    html: `
      <body style="font-family: 'Segoe UI', sans-serif; background:#f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:15px; box-shadow:0 12px 25px rgba(0,0,0,0.1); overflow:hidden;">

          <!-- Header -->
          <div style="background: linear-gradient(90deg, #ff7e5f, #feb47b); text-align:center; padding:30px;">
            <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="width:120px; margin-bottom:10px;">
            <h1 style="color:#fff; font-size:24px; margin:0;">Reset Your Password</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px; text-align:center; color:#555;">
            <p style="font-size:16px; line-height:1.6; margin-bottom:20px;">
              Use the following single-use code to reset your password:
            </p>

            <div style="display:inline-block; background:#ff7e5f; color:#fff; font-size:28px; padding:15px 25px; border-radius:10px; letter-spacing:3px; margin:20px 0;">
              ${values.otp}
            </div>

            <p style="font-size:14px; color:#888;">
              This code is valid for 3 minutes. Use it promptly to reset your password.
            </p>

            <p style="font-size:14px; color:#888; margin-top:20px; text-align:left;">
              If you did not request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; text-align:center; padding:20px; font-size:12px; color:#aaa;">
            © ${new Date().getFullYear()} FundRaise. All rights reserved.
          </div>

        </div>
      </body>
    `,
  };

  return data;
};

const donationConfirmation = (values: {
  name: string;
  email: string;
  amount: number;
  causeName: string | undefined;
  causeImage: string | undefined;
}) => {
  const data = {
    to: values.email,
    subject: '💚 Thank You for Your Donation!',
    html: `
      <body style="font-family: 'Segoe UI', sans-serif; background:#f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:15px; box-shadow:0 12px 25px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #28a745, #85d77f); text-align:center; padding:30px;">
            <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="width:120px; margin-bottom:10px;">
            <h1 style="color:#fff; font-size:24px; margin:0;">Hello ${
              values.name
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px; color:#555; text-align:center;">
            <p style="font-size:18px; line-height:1.6; margin-bottom:20px;">
              Thank you for your generosity! We have received your donation of 
              <strong style="color:#28a745;">$${
                values.amount
              }</strong> for <strong>${values.causeName}</strong>.
            </p>

            ${
              values.causeImage
                ? `<img src="http://10.10.7.23:5000${values.causeImage}" alt="${values.causeName}" style="width:100%; max-width:400px; border-radius:12px; margin-bottom:20px;">`
                : ''
            }

            <p style="font-size:16px; line-height:1.6;">
              Your support helps us make a real difference. Keep an eye on your email for updates on the cause!
            </p>

            <p style="font-size:14px; color:#888; margin-top:20px;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; text-align:center; padding:20px; font-size:12px; color:#aaa;">
            © ${new Date().getFullYear()} FundRaise. All rights reserved.
          </div>
        </div>
      </body>
    `,
  };

  return data;
};

const raffleConfirmation = (values: any) => {
  const ticketCodesHtml = values.ticketCodes
    ? `<p style="color:#555; font-size:16px; line-height:1.5; margin:15px 0;">
         Your Ticket Codes: <strong style="color:#28a745;">${values.ticketCodes.join(
           ', '
         )}</strong>
       </p>`
    : '';

  const data = {
    to: values.email,
    subject: '🎟️ Your Raffle Purchase is Confirmed!',
    html: `
      <body style="font-family: 'Segoe UI', sans-serif; background:#f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:15px; box-shadow:0 12px 25px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #28a745, #85d77f); text-align:center; padding:30px;">
            <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="width:120px; margin-bottom:10px;">
            <h1 style="color:#fff; font-size:24px; margin:0;">Hello ${
              values.name
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px; text-align:center; color:#555;">
            <p style="font-size:16px; line-height:1.6; margin-bottom:20px;">
              You have successfully purchased <strong>${
                values.totalTicket
              }</strong> raffle ticket(s).
            </p>

            <p style="font-size:16px; margin-bottom:10px;">
              Total Amount: <strong style="color:#28a745;">${
                values.TotalTaka
              } BDT</strong>
            </p>

            ${ticketCodesHtml}

            <p style="margin-top:20px; font-size:16px; color:#555;">
              Good luck! Keep an eye on your email for raffle results.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; text-align:center; padding:20px; font-size:12px; color:#aaa;">
            © ${new Date().getFullYear()} FundRaise. All rights reserved.
          </div>
        </div>
      </body>
    `,
  };

  return data;
};

// winner raffle
const raffleWinner = (values: {
  name: string;
  email: string;
  raffleName: string;
  ticketCodes?: string[];
  drawDate?: Date | null;
}) => {
  const ticketHtml =
    values.ticketCodes && values.ticketCodes.length
      ? `<div style="margin: 20px 0; padding: 15px; background: linear-gradient(90deg, #ff9a9e, #fad0c4); border-radius: 12px; display:inline-block; font-weight:bold; color:#fff; letter-spacing:2px;">
         ${values.ticketCodes.join(', ')}
       </div>`
      : '';

  const data = {
    to: values.email,
    subject: `🎉 Congratulations ${values.name}! You are a Raffle Winner!`,
    html: `
      <body style="font-family: 'Segoe UI', sans-serif; background:#f2f6fc; margin:0; padding:0;">
        <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:15px; box-shadow:0 12px 25px rgba(0,0,0,0.1); overflow:hidden;">

          <!-- Header -->
          <div style="background: linear-gradient(90deg, #ffb347, #ffcc33); text-align:center; padding: 30px;">
            <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="width:120px; margin-bottom:10px;">
            <h1 style="color:#fff; font-size:26px; margin:0;">🎉 Congratulations, ${
              values.name
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px; text-align:center; color:#555;">
            <p style="font-size:18px; line-height:1.6;">
              You’ve been selected as a <strong>winner</strong> in our raffle draw${
                values.raffleName
                  ? ` for <strong>${values.raffleName}</strong>`
                  : ''
              }!
            </p>
            ${ticketHtml}
            ${
              values.drawDate
                ? `<p style="color:#888; font-size:14px; margin-top:10px;">Draw Date: ${new Date(
                    values.drawDate
                  ).toLocaleDateString()}</p>`
                : ''
            }
            <p style="margin-top:20px; font-size:16px; color:#555;">
              Our team will contact you soon with further details about your prize.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; text-align:center; padding:20px; font-size:12px; color:#aaa;">
            Thank you for participating! — The FundRaise Team 💚
          </div>
        </div>
      </body>
    `,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  donationConfirmation,
  raffleConfirmation,
  raffleWinner,
};
