const express = require("express");
const dotnev = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utility/appError");
const GlobalErrorHandler = require("./controllers/errorController");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotnev.config({ path: "./config/config.env" });

const app = express();

// Body Parser START
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Devlopment logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("development"));
  console.log("App is now in development mode");
} else if (process.env.NODE_ENV == "production") {
  app.use(mogran("production"));
  console.log("App is now in production mode");
}

// Cors
if ((process.env.NODE_ENV = "development")) {
  app.use(
    cors({
      orgin: `https://localhost:3001`,
    })
  );
}

// Routes
app.use("/api/v1/users", authRoute);
app.use("/api/v1/user", userRoute);

// route middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler for DB
app.use(GlobalErrorHandler);

module.exports = app;
