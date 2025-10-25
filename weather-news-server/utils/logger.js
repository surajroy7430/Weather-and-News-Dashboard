const { createLogger, transports, format } = require("winston");
const { printf, timestamp, combine, colorize, errors } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true })),
  transports: [
    new transports.Console({
      format: combine(
        timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        errors({ stack: true }),
        printf(({ level, message, stack, timestamp, ...meta }) => {
          return `${timestamp} [${level?.toUpperCase()}]: ${message} ${
            stack || ""
          }${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
        }),
        colorize({
          all: true,
          colors: {
            info: "blue",
            warn: "yellow",
            error: "red",
            debug: "cyan",
            verbose: "gray",
            http: "green",
          },
        })
      ),
    }),

    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      format: combine(
        timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        errors({ stack: true })
      ),
    }),
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
      format: combine(
        timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        errors({ stack: true })
      ),
    }),
  ],
});

module.exports = logger;
