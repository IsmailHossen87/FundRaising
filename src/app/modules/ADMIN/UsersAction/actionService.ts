import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { User } from '../../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../../enums/user';
import { Charities } from '../../ORGANIZER/Charities/Charities.Model';
import Raffle from '../../ORGANIZER/raffel/raffel.model';
import mongoose from 'mongoose';
import { Dooner } from '../../ORGANIZER/Charities/Donner.model';

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

// allUser thats have Charity under raffle
const allUserUnderCharity = async (user: JwtPayload) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admin can get all Cheritist'
    );
  }

  const allRaffle = await Raffle.find().populate({
    path: 'causeId',
    select: 'causeName ',
  });

  if (!allRaffle) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }

  return allRaffle;
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

  // 🎟️ Total active raffles
  const raffleCount = await Raffle.countDocuments({ status: 'active' });
  const donorCount = await Dooner.countDocuments();
  const charities = await Charities.find();

  const totalRaffles = await Raffle.countDocuments();
  const successRaffles = await Raffle.countDocuments({ draw: 'success' });
  // 📊 Calculate success percentage
  const SuccessDraw =
    totalRaffles > 0 ? ((successRaffles / totalRaffles) * 100).toFixed(2)+"%" : 0;

  const totalCollection = charities.reduce((sum, item) => {
    return sum + (item.Totalcollection || 0);
  }, 0);

  // ✅ Return everything together
  return {
    raffleCount,
    donorCount,
    SuccessDraw,
    totalCollection,
  };
};

export const actionService = {
  statusChange,
  getAllCharitits,
  charitistStatus,
  allUserUnderCharity,
  RaffleStatusChange,
  dashboard,
};
