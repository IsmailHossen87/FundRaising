import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { redisClient } from '../../../config/radisConfig';

const OTP_EXPIRATION = 2 * 60; // 2 minutes in seconds

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  console.log('Creating user with payload:', payload); // Log the payload for debugging
  
  // Set role
  payload.role = USER_ROLES.USER;

  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }
  console.log('User created successfully:', createUser);

  // Generate OTP
  const otp = generateOTP();
  console.log('Generated OTP:', otp); // Log OTP for debugging
  
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  
  const redisKey = `otp:${createUser.email!}`;
  
  // Save OTP to Redis with 2-minute expiration
  console.log(`Saving OTP to Redis with key: ${redisKey}`);
  await redisClient.setEx(redisKey, OTP_EXPIRATION, otp.toString()); // 'setEx' ব্যবহার করে

  console.log(`OTP saved to Redis with expiration time of ${OTP_EXPIRATION} seconds`);

  // Send email
  const createAccountTemplate = emailTemplate.createAccount(values);
  console.log('Email template created:', createAccountTemplate); // Log email template
  
  emailHelper.sendEmail(createAccountTemplate);
  console.log('OTP email sent to:', createUser.email);

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
};
