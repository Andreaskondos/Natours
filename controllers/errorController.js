const AppError = require("../utils/appError");

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Ypur token has expired. Please log in again!", 401);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const devDisplay = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    }

    console.log("ERROR 💣", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }

  console.log("ERROR 💣", err);
  res.status(500).render("error", {
    title: "Something went wrong",
    msg: "Something went very wrong",
  });
};

const prodDisplay = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.log("ERROR 💣", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
  console.log("ERROR 💣", err);

  res.status(500).render("error", {
    title: "Something went wrong",
    msg: "Something went wrong. Try again later!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") devDisplay(err, req, res);
  else if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err));
    if (!error.message) error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    prodDisplay(error, req, res);
  }
};
