// import colors from 'colors';
// import { Server } from 'socket.io';
// import { logger } from '../shared/logger';

// const socket = (io: Server) => {
//   io.on('connection', socket => {
//     logger.info(colors.blue('A user connected'));

//     //disconnect
//     socket.on('disconnect', () => {
//       logger.info(colors.red('A user disconnect'));
//     });
//   });
// };

// export const socketHelper = { socket };


import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';

// userId অনুযায়ী connected socket track করার জন্য
const connectedUsers = new Map<string, string>();

const socket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(colors.blue('⚡ User connected'));

    // ✅ যখন ইউজার connect করবে তখন তার userId save করো
    socket.on('registerUser', (userId: string) => {
      connectedUsers.set(userId, socket.id);
      logger.info(colors.green(`🟢 User registered: ${userId}`));
    });

    // ✅ Disconnect হলে remove করে দাও
    socket.on('disconnect', () => {
      for (const [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) connectedUsers.delete(userId);
      }
      logger.info(colors.red('🔴 User disconnected'));
    });
  });
};

// ✅ Helper function for sending notification dynamically
const sendNotification = (userId: string, data: any) => {
  const socketId = connectedUsers.get(userId);
  if (socketId && global.io) {
    global.io.to(socketId).emit('NEW_NOTIFICATION', data);
  }
};

export const socketHelper = { socket, sendNotification };
