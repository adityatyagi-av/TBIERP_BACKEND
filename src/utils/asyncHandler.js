const asyncHandler = function (requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      res
        .status(err.code || 500)
        .json({
          success: false,
          status: err.statusCode || 555,
          message: err.message,
        })
        .json(err);
      next(err);
    });
  };
};

export { asyncHandler };
