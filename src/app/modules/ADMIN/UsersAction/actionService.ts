import { StatusCodes } from "http-status-codes";
import ApiError from "../../../../errors/ApiError";
import { User } from "../../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../../../../enums/user";
import { Cause } from "../../ORGANIZER/Charities/Charities.Model";


const getAllCharitits = async ( user: JwtPayload) => {
  if ( USER_ROLES.ADMIN !== user.role ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Only admin can get all Cheritist");
  }
  const result = await Cause.find();
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cheritist not found");
  }

  return result;
};


const statusChange = async (authUser: JwtPayload, userId: string) => {
  if (authUser.role !== USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Only admin can update user status");
  }

  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const newStatus = "Blocked"

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
    throw new ApiError(StatusCodes.FORBIDDEN, "Only admin can update user status");
  }
  const isExistUser = await Cause.findById(charitistId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Charitist not found");
  }
  const currentStatus = isExistUser.status;

  let newStatus;
  if (currentStatus === "Pending") {
    newStatus = "Active";
  } else if (currentStatus === "Active") {
    newStatus = "Rejected";
  } else if (currentStatus === "Rejected") {
    newStatus = "Active"; 
  } else {
    newStatus = "Pending"; 
  }
  const updatedUser = await Cause.findByIdAndUpdate(
    charitistId,
    { status: newStatus },
    { new: true }
  );

  return updatedUser;
};


export const actionService ={statusChange,getAllCharitits,charitistStatus}