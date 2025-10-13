import { StatusCodes } from "http-status-codes";
import ApiError from "../../../../errors/ApiError";
import { User } from "../../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../../../../enums/user";

const statusChange = async (authUser: JwtPayload, userId: string) => {
  // Check admin role
  if (authUser.role !== USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Only admin can update user status");
  }

  // Check if user exists
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const newStatus = "Blocked"

  // Update and return updated user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status: newStatus },
    { new: true }
  );

  return updatedUser;
};



export const actionService ={statusChange}