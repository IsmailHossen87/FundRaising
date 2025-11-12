import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { User } from '../../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../../enums/user';
import { Charities } from '../../ORGANIZER/Charities/Charities.Model';
import Raffle from '../../ORGANIZER/raffel/raffel.model';
import { Dooner } from '../../ORGANIZER/Charities/Donner.model';
import { QueryBuilder } from '../../../../util/QueryBuilder';
import { excludeField } from '../../../../util/Constants';

const getAllCharitits = async (user: JwtPayload) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admin can get all Cheritist'
    );
  }
  const result = await Charities.find().populate({
    path: 'userId',
    select: 'name email',
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cheritist not found');
  }

  return result;
};

const statusChange = async (authUser: JwtPayload, userId: string) => {
  if (authUser.role !== USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admin can update user status'
    );
  }

  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const currentStatus = isExistUser.status;

  let newStatus;
  if (currentStatus === 'Active') {
    newStatus = 'Blocked';
  } else if (currentStatus === 'Blocked') {
    newStatus = 'Active';
  } else {
    newStatus = 'Active';
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status: newStatus },
    { new: true }
  );

  return updatedUser;
};

// Charitist Status Change
const charitistStatus = async (authUser: JwtPayload, charitistId: string) => {
  if (authUser.role !== USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admin can update user status'
    );
  }
  const isExistUser = await Charities.findById(charitistId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Charitist not found');
  }
  const currentStatus = isExistUser.status;

  let newStatus;
  if (currentStatus === 'Pending') {
    newStatus = 'Active';
  } else if (currentStatus === 'Active') {
    newStatus = 'Rejected';
  } else if (currentStatus === 'Rejected') {
    newStatus = 'Active';
  } else {
    newStatus = 'Pending';
  }
  const updatedUser = await Charities.findByIdAndUpdate(
    charitistId,
    { status: newStatus },
    { new: true }
  );

  return updatedUser;
};

const getAllRafflesFromDB = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You are not permit for this Api'
    );
  }
  const queryBuilder = new QueryBuilder(Raffle.find(), query);

  const allRaffles = queryBuilder
    .search(excludeField)
    .filter()
    .dateRange()
    .sort()
    .fields()
    .paginate();

  const [meta, data] = await Promise.all([
    queryBuilder.getMeta(),
    allRaffles.build(),
  ]);

  return { meta, data };
};

// Raffle Status Change
const RaffleStatusChange = async (user: JwtPayload, raffleId: string) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admin can Change Status');
  }

  const raffle = await Raffle.findById(raffleId);
  if (!raffle) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Raffle are not available');
  }
  const currentStatus = raffle.status;

  let newStatus;
  if (currentStatus === 'active') {
    newStatus = 'suspended';
  } else if (currentStatus === 'suspended') {
    newStatus = 'active';
  } else {
    newStatus = 'active';
  }
  const UpdateRaffle = await Raffle.findByIdAndUpdate(
    raffleId,
    { status: newStatus },
    { new: true }
  );

  return UpdateRaffle;
};
// All DashBoard
const dashboard = async (user: JwtPayload) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admin can view dashboard');
  }

  const raffleCount = await Raffle.countDocuments({ status: 'active' });
  const donorCount = await Dooner.countDocuments();

  // Fetch all charities with only causeName and Totalcollection, sorted by Totalcollection descending
  const charities = await Charities.find()
    .select('causeName Totalcollection -_id') // only select causeName and Totalcollection, remove _id
    .sort({ Totalcollection: -1 });

  const totalRaffles = await Raffle.countDocuments();
  const successRaffles = await Raffle.countDocuments({ draw: 'success' });

  // 📊 Calculate success percentage
  const SuccessDraw =
    totalRaffles > 0
      ? ((successRaffles / totalRaffles) * 100).toFixed(2) + '%'
      : 0;

  // 💰 Total collection from all charities
  const totalCollection = charities.reduce((sum, item) => {
    return sum + (item.Totalcollection || 0);
  }, 0);

  // 🗓️ Monthly donor contribution chart data
  const monthlyDonations = await Dooner.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        Amount: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // 🧑‍💻 Monthly user registration data
  const monthlyUsers = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // ✅ Format month names for frontend chart
  const formatMonth = (num: number) =>
    new Date(0, num - 1).toLocaleString('default', { month: 'short' });

  const donorChart = monthlyDonations.map(d => ({
    month: `${formatMonth(d._id.month)} ${d._id.year}`,
    Amount: d.Amount,
  }));

  const userChart = monthlyUsers.map(u => ({
    month: `${formatMonth(u._id.month)} ${u._id.year}`,
    totalUsers: u.totalUsers,
  }));

  // ✅ Return everything together
  return {
    raffleCount,
    donorCount,
    SuccessDraw,
    totalCollection,
    charities, // only causeName & Totalcollection
    donorChart,
    userChart,
  };
};

export const actionService = {
  statusChange,
  getAllCharitits,
  getAllRafflesFromDB,
  RaffleStatusChange,
  dashboard,
  charitistStatus,
};
