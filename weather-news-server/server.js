require("dotenv").config({ quiet: true });
const express = require("express");
const logger = require("./utils/logger");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const newsRouter = require("./routes/news.routes");
const weatherRouter = require("./routes/weather.routes");
const locationRouter = require("./routes/location.routes");
const applyMiddlewares = require("./middlewares/applyMiddlewares");
const { errorHandler } = require("./middlewares/errorHandler");
const { connectToDB, disconnectDB } = require("./config/db");

const app = express();
applyMiddlewares(app);

let isDBConnected = false;

// Health check route
app.get("/", (req, res) => {
  res.send({
    message: `Server is running...`,
    db: isDBConnected ? "Connected to MongoDB" : "Failed to connect to MongoDB",
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/locations", locationRouter);


// Unknown Routes (404)
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    isDBConnected = await connectToDB();

    const PORT = Number(process.env.PORT || 5000);
    const server = app.listen(PORT, () =>
      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      )
    );

    const gracefulShutdown = async (signal) => {
      logger.warn(`Received ${signal}. Shutting down server...`);

      server.close(async () => {
        logger.warn("HTTP server closed");
        await disconnectDB();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forcing shutdown...");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
