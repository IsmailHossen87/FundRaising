import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import { connectRedis } from './config/radisConfig';

// 🔴 Handle uncaught exceptions (synchronous errors)
process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected', error);
  process.exit(1);
});

let server: any;

async function main() {
  try {
    // ✅ 1. Connect Database
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    // ✅ 2. Port Setup (Always ensure it's a number)
    const port = Number(config.port) || 5000;
    const ipAddress = config.ip_address || '0.0.0.0';

    // ✅ 3. Start Server
    server = app.listen(port, ipAddress, () => {
      logger.info(
        colors.yellow(`♻️  Application listening on ${ipAddress}:${port}`)
      );
    });

    // ✅ 4. Initialize Socket.IO
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: { origin: '*' },
    });

    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;

  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to start server or connect DB'), error);
    process.exit(1);
  }

  // ✅ 5. Handle unhandled Promise rejections
  process.on('unhandledRejection', error => {
    errorLogger.error('Unhandled Rejection Detected', error);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

// ✅ Connect Redis first, then Main App
(async () => {
  try {
    await connectRedis();
    logger.info(colors.cyan('Redis connected successfully!'));
    await main();
  } catch (error) {
    errorLogger.error(colors.red('Redis connection failed'), error);
    process.exit(1);
  }
})();

// ✅ 6. Handle SIGTERM (for graceful shutdown)
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully...');
  if (server) {
    server.close(() => logger.info('Server closed.'));
  }
});
