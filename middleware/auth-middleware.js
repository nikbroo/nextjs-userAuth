const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  const accessToken = token && token.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Access Denied",
    });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access Denied",
      error,
    });
  }
};

module.exports = authMiddleware;
