import { Charities } from './../Charities/Charities.Model';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IRaffle } from './raffel.interface';
import Raffle, { Allticket } from './raffel.model';
import { emailTemplate } from '../../../../shared/emailTemplate';
import { emailHelper } from '../../../../helpers/emailHelper';

// Create raffle
const createRaffleToDB = async (payload: IRaffle) => {
  const cause = await Charities.findById(payload.causeId);
  if (!cause) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Carity is not Available');
  }
  const isExist = await Raffle.findOne({ raffleName: payload.raffleName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle name already exists');
  }

  const result = await Raffle.create(payload);
  return result;
};

// Get all raffles
const getAllRafflesFromDB = async (queryFields: Record<string, any>) => {
  const { search, page, limit, ...filters } = queryFields;
  const query = search
    ? {
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { recipientGroup: { $regex: search, $options: 'i' } },
        ],
        ...filters,
      }
    : { ...filters };

  let queryBuilder = Raffle.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
  } else {
    queryBuilder = queryBuilder.skip(0).limit(10);
  }
  queryBuilder = queryBuilder.sort({ createdAt: -1 });
  const result = await queryBuilder;
  const totalNotification = await Raffle.countDocuments(query);
  const totalActive = await Raffle.countDocuments({ status: 'active' });
  const totalPages = limit ? Math.ceil(totalNotification / Number(limit)) : 1;

  return {
    result,
    meta: {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      total: totalNotification,
      active: totalActive,
      totalPages,
    },
  };
};

// Get single raffle
const getRaffleByIdFromDB = async (id: string) => {
  const raffle = await Raffle.findById(id);
  if (!raffle) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return raffle;
};

// Get my raffle
const getMyRaffle = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID format');
  }
  const objectId = new mongoose.Types.ObjectId(id);

  const raffle = await Raffle.find({ userId: objectId });

  if (!raffle || raffle.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }

  return raffle;
};

// Update raffle
const updateRaffleInDB = async (id: string, payload: Partial<IRaffle>) => {
  const updated = await Raffle.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return updated;
};

// Delete raffle
const deleteRaffleFromDB = async (id: string) => {
  const deleted = await Raffle.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return deleted;
};
//all participant
// const allParticipant = async () => {
//   const result = await RafflePurchase.find();

//   if (!result) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }
//   return result;
// };

const getRandomWinner = async (id: string, count: number) => {
  const raffleID = new mongoose.Types.ObjectId(id);

  const tickets = await Allticket.find({ raffleId: raffleID });
  if (!tickets.length) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No tickets found for this raffle'
    );
  }

  const winners = await Allticket.aggregate([
    { $match: { raffleId: raffleID, winner: false } },
    { $sample: { size: count } },
  ]);

  if (!winners.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No eligible tickets found for drawing winners'
    );
  }

  const winnerIds = winners.map(w => w._id);

  await Allticket.updateMany(
    { _id: { $in: winnerIds } },
    { $set: { winner: true } }
  );

  // Change Raffle Status
   await Raffle.findByIdAndUpdate(id,{status:"closed"})
  // Fetch winners with user & raffle info
  const updatedWinners = await Allticket.find({ _id: { $in: winnerIds } })
    .populate({ path: 'userId', select: 'firstName surName email' })
    .populate({ path: 'raffleId', select: 'raffleName' });

  // 🔹 Group winners by userId so one email per user
  const userMap = new Map< string, { user: any; raffleName: string; tickets: string[] }>();

  for (const winner of updatedWinners) {
    const user = winner.userId as {
      firstName: string;
      surName: string;
      email: string;
    };
    const raffle = winner.raffleId as { raffleName: string };

    if (!userMap.has(user.email)) {
      userMap.set(user.email, {
        user,
        raffleName: raffle.raffleName,
        tickets: winner.uniqueCode ? [winner.uniqueCode] : [],
      });
    } else if (winner.uniqueCode) {
      userMap.get(user.email)!.tickets.push(winner.uniqueCode);
    }
  }

  // 🔹 Send one email per user
  for (const { user, raffleName, tickets } of userMap.values()) {
    const value = {
      name: `${user.firstName} ${user.surName}`,
      email: user.email,
      raffleName,
      ticketCodes: tickets,
    };

    const CongratulationEmail = emailTemplate.raffleWinner(value);
    await emailHelper.sendEmail(CongratulationEmail);
  }

  return updatedWinners;
};

const allWinner = async (id: string) => {
  const raffleID = new mongoose.Types.ObjectId(id);
  const Ticket = await Allticket.find({ raffleId: raffleID });
  if (!Ticket) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Ticket is not available');
  }
  const result = await Allticket.aggregate([
    { $match: { raffleId: raffleID, winner: true } },
  ]);
  return result;
};

export const RaffleService = {
  createRaffleToDB,
  getAllRafflesFromDB,
  getRaffleByIdFromDB,
  updateRaffleInDB,
  deleteRaffleFromDB,
  getMyRaffle,
  // allParticipant,
  getRandomWinner,
  allWinner,
};
