import { Schema, model } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  recipientGroup: {
    type: String,
    required: true,
  },
  dateSent: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Sent', 'Draft'],
    default: 'Draft',
  },
  recipientType: {
    type: String,
    enum: ['Active', 'Closed', 'Winner Announced'],
    default: 'Active',
  },
});

const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
