module.exports = (req, res, next) => {
  res.SendData = (data, code = 200) => {
    return res.status(code).json(data);
  };
  res.ServerError = (err, code = 500) => {
    return res.status(code).json({ message: err.message || 'Internal Server Error', error: err });
  };
  res.NotFound = (msg = 'Not Found', code = 404) => {
    return res.status(code).json({ message: msg });
  };
  res.BadRequest = (msg = 'Bad Request', code = 400) => {
    return res.status(code).json({ message: msg });
  };
  next();
};
