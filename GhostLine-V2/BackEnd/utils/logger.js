const { createLogger, format, transports } = require('winston');

// Shared log format with timestamp and custom formatting
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Create a single logger instance that handles different log levels
const logger = createLogger({
  level: 'info', // Default level (logs will be filtered based on this level)
  format: logFormat, // Reuse the common format
  transports: [
    new transports.Console({ // Log to console with color and custom format
      format: format.combine(
        format.colorize(),
        logFormat
      ),
    }),
    new transports.File({ filename: 'logs/app.log' }) // Log to file for general logs
  ],
});

// Add an additional file transport for error logs, specifically logging errors to a different file
logger.add(new transports.File({
  level: 'error', // Only log errors to this file
  filename: 'logs/app.log'
}));

module.exports = logger;
