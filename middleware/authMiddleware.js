const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; //extract token

  if (!token) {
    return res.status(401).json({
      message: 'Access Denied, No Token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    console.log('authenticated');
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Invalid Token',
    });
  }
};

module.exports = authenticate;
