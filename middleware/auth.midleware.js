const asyncHandler = require("express-async-handler");
const { verifyAccessToken } = require("../services/jwt.service");

const authenticate = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization;
  let token = null;

  if (auth && auth.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Authorization required" });
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = { sub: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
});

module.exports = authenticate;
