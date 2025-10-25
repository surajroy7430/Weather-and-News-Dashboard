const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
// const mongoSanitize = require("express-mongo-sanitize");
const logger = require("../utils/logger");
const {
  colorizeMethod,
  colorizeStatus,
  colorizeTime,
} = require("../utils/colorize-msg");

const applyMiddlewares = (app) => {
  // Logging
  if (process.env.NODE_ENV !== "production") {
    app.use(
      morgan(
        (tokens, req, res) => {
          const method = tokens.method(req, res);
          const url = tokens.url(req, res);
          const status = Number(tokens.status(req, res));
          const time = tokens["response-time"](req, res);

          return `${colorizeMethod(
            method,
            `[${method} - ${url}]`
          )} | ${colorizeStatus(status)} | ${colorizeTime(time)}`;
        },
        {
          stream: { write: (msg) => logger.info(msg.trim()) },
        }
      )
    );
  }

  // Core parsers
  app.use(require("express").json());
  app.use(cookieParser());

  // Security
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(compression());
  // app.use(
  //   mongoSanitize({
  //     replaceWith: "_",
  //     onSanitize: ({ req, key }) => {
  //       console.warn(`Sanitized key: ${key}`);
  //     },
  //   })
  // );
};

module.exports = applyMiddlewares;
