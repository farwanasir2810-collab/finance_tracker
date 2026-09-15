exports.SendData = (res, data, code = 200) => res.status(code).json(data);
exports.ServerError = (res, err, code = 500) => res.status(code).json({ message: err.message || 'Server error' });
exports.NotFound = (res, msg = 'Not found', code = 404) => res.status(code).json({ message: msg });
exports.BadRequest = (res, msg = 'Bad request', code = 400) => res.status(code).json({ message: msg });
