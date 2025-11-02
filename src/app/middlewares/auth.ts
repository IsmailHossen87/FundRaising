import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import { User } from '../modules/user/user.model';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];

        //verify token
        const verifyUser = jwtHelper.verifyToken(
          token,
          config.jwt.jwt_secret as Secret
        );
        //set user to header
        req.user = verifyUser;

        console.log(req.user);
        const id = req.user.id;

        const user = await User.findById(id);
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

        //guard user
        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api"
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
