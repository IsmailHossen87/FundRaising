import { Schema, model } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },

  isDraft:{type:Boolean,default:true},
  message:{type:String},
  DeliveryMethod: {
    type: String,enum: ['email', 'notification']},
  recipientType: {
    type: String,
    enum: ['active', 'closed', 'Winner'],
    default: 'active',
  },
},{
  versionKey:false,timestamps:true
});

const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
