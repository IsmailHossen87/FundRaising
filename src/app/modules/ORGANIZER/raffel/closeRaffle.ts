import Raffle from "./raffel.model";
import cron from 'node-cron';

export const closeRaffle = async () => {
    const today = new Date();
    await Raffle.updateMany(
        {
            ticketSaleEndDate: { $lt: today },
            status: { $ne: 'closed' },
        },
        {
            $set: { status: 'closed' },
        }
    );
}


export const startRaffleCron = async () => {
    cron.schedule('0 * * * *', async () => {
        try {
            await closeRaffle();
            console.log("🎊🎉🎊 Raffle closed successfully");
        } catch (error) {
            console.log(error);
        }
    }, {
        timezone: 'Asia/Dhaka'
    });
}



// | Field        | Value  | Meaning
// | ------------ | -----  | ------------------------------------------------
// | Minute       | 0     | 0th minute (যখন ঘড়ির minute = 0)
// | Hour         | *     | প্রতি hour (0–23) → অর্থাৎ 12AM, 1AM, 2AM … 11PM
// | Day of Month | *     | প্রতি দিন
// | Month        | *     | প্রতি মাস
// | Day of Week  | 1-7   | Monday → Sunday


// * * * * *
// | | | | |
// | | | | └── Day of week (0–7, 0 or 7 = Sunday)
// | | | └──── Month (1–12)
// | | └────── Day of month (1–31)
// | └──────── Hour (0–23)
// └────────── Minute (0–59)    🎊🎉value na dile every moment🎊
