import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: {
  name: string;
  email: string;
  otp: number;
}) => {
  const data = {
    to: values.email,
    subject: 'Verify your Fundraising Account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hello ${values.name}, Welcome to FundRaise!</h2>
          <div style="text-align: center;">
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your verification code is:</p>
              <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes. Use it to verify your fundraising account and start your campaign.</p>
          </div>
          <p style="color: #555; font-size: 14px; line-height: 1.5;">If you did not request this, please ignore this email.</p>
      </div>
    </body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://ibb.co.com/HDN60nqv" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
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
    subject: 'Thank You for Your Donation!',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hello ${values.name}, Thank You for Your Generosity!</h2>
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="http://10.10.7.23:5000${values.causeImage}" alt="${values.causeName}" style="width: 100%; max-width: 400px; border-radius: 10px; margin-bottom: 15px;" />
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We have received your donation of <strong>$${values.amount}</strong> for <strong>${values.causeName}</strong>.</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your support helps us make a real difference. Keep an eye on your email for updates on the cause!</p>
          </div>
          <p style="color: #555; font-size: 14px; line-height: 1.5;">If you have any questions, feel free to contact our support team.</p>
      </div>
    </body>`,
  };
  return data;
};

const raffleConfirmation = (values: any) => {
  const ticketCodesHtml = values.ticketCodes
    ? `<p style="color: #555; font-size: 16px; line-height: 1.5;">
        Your Ticket Codes: <strong>${values.ticketCodes.join(', ')}</strong>
      </p>`
    : '';

  const data = {
    to: values.email,
    subject: 'Raffle Purchase Confirmation',
    html: `
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="width: 100%; max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hello ${values.name}, Your Raffle Purchase is Confirmed!</h2>
          <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              You have successfully purchased <strong>${values.totalTicket}</strong> raffle ticket(s).
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Total Amount: <strong>${values.TotalTaka} BDT</strong>
            </p>
            ${ticketCodesHtml}
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
              Good luck! Keep an eye on your email for raffle results.
            </p>
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
  code: string | null | undefined;
  drawdate: Date | null | undefined;
}) => {
  const data = {
    to: values.email,
    subject: `🎉 Congratulations ${values.name}! You are a Raffle Winner!`,
    html: `
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #fff; border-radius: 12px; box-shadow: 0 0 12px rgba(0,0,0,0.1);">
          <img src="https://ibb.co.com/HDN60nqv" alt="FundRaise Logo" style="display: block; margin: 0 auto 25px; width:150px" />
          
          <h2 style="color: #277E16; font-size: 26px; text-align: center;">🎉 Congratulations, ${
            values.name
          }!</h2>
          
          <p style="text-align: center; color: #333; font-size: 18px; line-height: 1.6; margin-top: 15px;">
            You’ve been selected as a <strong>winner</strong> in our raffle draw${
              values.raffleName
                ? ` for <strong>${values.raffleName}</strong>`
                : ''
            }!
          </p>

          <div style="text-align: center; margin-top: 25px;">
            ${
              values.code
                ? `<p style="color: #555; font-size: 18px; margin-bottom: 10px;">Your Winning Ticket Code:</p>
                   <div style="background-color: #277E16; color: #fff; display: inline-block; padding: 12px 20px; border-radius: 8px; font-size: 22px; letter-spacing: 2px;">
                     ${values.code}
                   </div>`
                : ''
            }

            ${
              values.drawdate
                ? `<p style="color: #888; font-size: 14px; margin-top: 15px;">Draw Date: ${new Date(
                    values.drawdate
                  ).toLocaleDateString()}</p>`
                : ''
            }
          </div>

          <p style="color: #444; font-size: 16px; line-height: 1.6; margin-top: 25px;">
            Our team will contact you soon with further details about your prize. Please keep this email for your reference.
          </p>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="text-align: center; color: #888; font-size: 14px;">
            Thank you for participating in our raffle!<br/>
            — The FundRaise Team 💚
          </p>
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
