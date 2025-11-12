import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { INotification } from './notification.interface';
import { USER_ROLES } from '../../../../enums/user';
import Notification from './notification.model';
import { JwtPayload } from 'jsonwebtoken';
import { QueryBuilder } from '../../../../util/QueryBuilder';
import { excludeField } from '../../../../util/Constants';
import Raffle, { Allticket } from '../../ORGANIZER/raffel/raffel.model';
import { User } from '../../user/user.model';
import { Types } from 'mongoose';
import { emailHelper } from '../../../../helpers/emailHelper';
import { notificationEmailTemplates } from '../../../../shared/NotificationTemplate';

const createNotification = async (payload: INotification) => {
  const { userId, title, isDraft, DeliveryMethod, recipientType, message } =
    payload;

  // 🟢 1️⃣ Draft হলে, update করো
  if (isDraft) {
    let notification = await Notification.findOne({
      userId,
      title,
      isDraft: true,
    });

    if (notification) {
      notification = await Notification.findByIdAndUpdate(
        notification._id,
        { $set: payload },
        { new: true, runValidators: true }
      );
      return notification;
    }
  }

  // 🟢 2️⃣ Create Notification
  const result = await Notification.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create notification!'
    );
  }

  // 🟢 3️⃣ Receiver data বের করো
  let users: any[] = [];

  if (recipientType === 'Winner') {
    // 🏆 Winner case: AllTickets থেকে winner খুঁজবে
    const winnerTickets = await Allticket.find({ isWinner: true }).select(
      'userId raffleId uniqueCode'
    );

    const userIds = winnerTickets.map(t => t.userId.toString());
    const uniqueUserIds = [...new Set(userIds)]; //winner সকল USER কে Store করতেছি

    users = await User.find({ _id: { $in: uniqueUserIds } }).select( 'name email');

    // message handle (email or socket)
    for (const user of users) {
      if (DeliveryMethod === 'email') {
        const emailData = notificationEmailTemplates.raffleWinner({
          name: user.name,
          raffleName: 'Raffle Name',
          message: message,
        });
        emailData.to = user.email;
        await emailHelper.sendEmail(emailData);
      } else {
        // 🔔 (socket.io)
        const notificationData = {type: 'Winner',title, message: message,date: new Date()};
        //@ts-ignore
        global.io?.to(user._id.toString()).emit('NEW_NOTIFICATION', notificationData);
      }
    }
  } else {
    // 🟠 Active / Closed case: Raffle থেকে buyer list
    const raffles = await Raffle.find({status: recipientType,ticketBuyers: { $exists: true, $not: { $size: 0 } }});

    const userIds = raffles.flatMap(r => r.ticketBuyers) as Types.ObjectId[];
    const uniqueUserIds = [...new Set(userIds.map(id => id.toString()))];

    users = await User.find({ _id: { $in: uniqueUserIds } }).select(
      'name email'
    );

    for (const user of users) {
      if (DeliveryMethod === 'email') {
        // ✉️ Email পাঠাও
        const emailData = notificationEmailTemplates.genericNotification(
          user.name,
          message
        );
        emailData.to = user.email;
        await emailHelper.sendEmail(emailData);
      } else {
        // 🔔 Real-time notification পাঠাও (socket.io)
        const notificationData = {type: recipientType,title,message, date: new Date(), };
        //@ts-ignore
        global.io ?.to(user._id.toString()).emit('NEW_NOTIFICATION', notificationData);
      }
    }
  }

  return result;
};
const updateNotification = async (
  notificationId: string,
  user: JwtPayload,
  payload: INotification
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
  });
  if (!notification) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Notification not found!');
  }
  if (USER_ROLES.ADMIN != user.role) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Only admin can update it');
  }
  const updateNotification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return updateNotification;
};

// all Notification
const getAllNotifications = async (query: Record<string, any>, user: any) => {
  if (USER_ROLES.ADMIN !== user.role) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You are not permit for this Api'
    );
  }
  const queryBuilder = new QueryBuilder(Notification.find(), query);

  const allNotification = queryBuilder
    .search(excludeField)
    .filter()
    .dateRange()
    .sort()
    .fields()
    .paginate();

  const [meta, data] = await Promise.all([
    queryBuilder.getMeta(),
    allNotification.build(),
  ]);

  return { meta, data };
};

const getNotificationById = async (
  id: string
): Promise<INotification | null> => {
  const result = await Notification.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Notification not found!');
  }
  return result;
};

const deleteNotification = async (
  id: string
): Promise<INotification | null> => {
  const isExistNotification = await getNotificationById(id);
  if (!isExistNotification) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Notification not found!');
  }

  const result = await Notification.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to delete notification!'
    );
  }
  return result;
};

const getNotificationCount = async (user: any): Promise<number> => {
  const result = await Notification.countDocuments({
    ...(user.role === USER_ROLES.ADMIN ? {} : { user: user.id }),
    status: 'unread',
  });
  return result;
};

export const NotificationService = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationCount,
};
