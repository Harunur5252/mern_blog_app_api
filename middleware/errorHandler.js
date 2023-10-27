const notFound = (req, res, next) => {
  // ${req.originalUrl}
  const error = new Error(`Url Not Found`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  //if mongoose not found error, set 404 and change message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    let errMsg = "Resource not found";
    return res.status(statusCode).json({
      errMsg,
      stack: process.env.DEV === "production" ? null : err.stack,
    });
  }

  return res.status(statusCode).json({
    errMsg: err.message || err,
    stack: process.env.DEV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
