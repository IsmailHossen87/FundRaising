import { JwtPayload } from 'jsonwebtoken';

declare global {
  var io: Server | undefined;
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user?: JwtPayload;
    }
  }
}
