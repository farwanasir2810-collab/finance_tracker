module.exports = {
  isAuth: (req, res, next) => {
    req.user = { id: '1', email: 'test@meblabs.com' };
    next();
  }
};
