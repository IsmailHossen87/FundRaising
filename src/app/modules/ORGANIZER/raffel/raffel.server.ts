import { Charities } from './../Charities/Charities.Model';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import mongoose from 'mongoose';
import { IRaffle } from './raffel.interface';
import Raffle, { Allticket } from './raffel.model';
import { emailTemplate } from '../../../../shared/emailTemplate';
import { emailHelper } from '../../../../helpers/emailHelper';
import { User } from '../../user/user.model';
import { QueryBuilder } from '../../../../util/QueryBuilder';
import { excludeField } from '../../../../util/Constants';

// Create raffle
const createRaffleToDB = async (payload: IRaffle) => {
  const cause = await Charities.findByIdAndUpdate(payload.causeId, {
    raffleId: new mongoose.Types.ObjectId(payload.causeId),
  });
  if (!cause) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Carity is not Available');
  }
  const isExist = await Raffle.findOne({ raffleName: payload.raffleName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle name already exists');
  }
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  // if (!user.stripeAccountInfo?.stripeConnectedAccount) {
  //   throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not have a connected Stripe account');
  // }
  const result = await Raffle.create(payload);
  return result;
};


// Create raffle
const createMonthlyRaffleToDB = async (payload: IRaffle) => {

  const isExist = await Raffle.findOne({ raffleName: payload.raffleName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle name already exists');
  }
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  // if (!user.stripeAccountInfo?.stripeConnectedAccount) {
  //   throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not have a connected Stripe account');
  // }
  const result = await Raffle.create(payload);
  return result;
};

const getAllRafflesFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Raffle.find(), query);

  const allRaffles = queryBuilder
    .search([])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    allRaffles.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
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
const getMyRaffle = async (id: string, query: Record<string, any>) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID format');
  }

  const userId = new mongoose.Types.ObjectId(id);

  // Find all raffles created by this user
  const raffleQuery = Raffle.find({ userId });

  // Apply query builder utilities (search, filter, sort, etc.)
  const queryBuilder = new QueryBuilder(raffleQuery, query)
    .search(excludeField)
    .filter()
    .sort()
    .fields()
    .paginate();

  // Run queries
  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
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
// all participant
const allParticipant = async () => {
  const usersWithRaffle = await User.find({
    'raffleId.0': { $exists: true },
  });

  if (!usersWithRaffle) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return usersWithRaffle;
};

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
  await Raffle.findByIdAndUpdate(id, { status: 'closed', draw: 'success' });

  const updatedWinners = await Allticket.find({ _id: { $in: winnerIds } })
    .populate({ path: 'userId', select: 'firstName surName email' })
    .populate({ path: 'raffleId', select: 'raffleName' });

  // 🔹 Group winners by userId so one email per user
  const userMap = new Map<
    string,
    { user: any; raffleName: string; tickets: string[] }
  >();

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
      name: `${user.name}`,
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
  const raffle = await Raffle.findById(id);
  if (!raffle) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Raffle is not available');
  }
  const Ticket = await Allticket.find({ raffleId: raffleID });
  if (!Ticket) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Ticket is not available');
  }
  const result = await Allticket.aggregate([
    { $match: { raffleId: raffleID, winner: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $project: {
        _id: 1,
        raffleId: 1,
        uniqueCode: 1,
        winner: 1,
        drawDate: 1,
        'userData.name': 1,
        'userData.email': 1,
      },
    },
  ]);
  return result;
};

export const RaffleService = {
  createRaffleToDB,
  createMonthlyRaffleToDB,
  getAllRafflesFromDB,
  getRaffleByIdFromDB,
  updateRaffleInDB,
  deleteRaffleFromDB,
  getMyRaffle,
  allParticipant,
  getRandomWinner,
  allWinner,
};
