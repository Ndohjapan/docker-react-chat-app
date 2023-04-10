// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let errors = err.errors;
  let validationErrors;
  if (errors) {
    validationErrors = {};
    errors.forEach((error) => {
      validationErrors[error.param] = error.msg;
    });
  }

  return res.status(err.status).send({
    path: req.originalUrl,
    timestamp: new Date().getTime(),
    message: err.message,
    validationErrors,
  });
};
