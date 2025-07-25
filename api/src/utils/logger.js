const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, align } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()]
});

module.exports = logger;