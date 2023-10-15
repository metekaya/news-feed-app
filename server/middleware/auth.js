const jwt = require("jsonwebtoken");
const { Constants } = require("../constants");

module.exports = {
  // Middleware for authentication of the user token.
  authenticateToken: (req, res, next) => {
    // Get the desired format of token from request headers.
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // No token means not Authorized!!
    if (token == null) return res.sendStatus(401);

    // If verified, proceed with the request..
    jwt.verify(token, Constants.secretKey, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  },
};
