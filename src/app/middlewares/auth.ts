import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import { User } from '../modules/user/user.model';
import config from '../../config';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (!tokenWithBearer.startsWith('Bearer')) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token format');
      }

      const token = tokenWithBearer.split(' ')[1];

      // 🔐 Verify token
      const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      // 🧾 Token থেকে পাওয়া user info
      req.user = verifyUser;

      // 🔎 User database থেকে খোঁজা
      const user = await User.findById(verifyUser.id);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
      }

      // 🚫 Blocked user check
      if (user.status === 'Blocked') {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'Your account is blocked. Please contact support.'
        );
      }

      // 🔐 Role-based access check
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You don't have permission to access this API"
        );
      }

      // ✅ সব ঠিক থাকলে next()
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
