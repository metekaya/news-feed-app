const jwt = require("jsonwebtoken");
const { Constants } = require("../constants");

module.exports = {
  authenticateToken: (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log(authHeader);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, Constants.secretKey, (err, user) => {
      console.log(err);
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
};
