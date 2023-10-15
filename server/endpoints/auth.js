const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Constants } = require("../constants");

const User = require("../models/user");

module.exports = {
  login: async function (req, res) {
    // Endpoint for authenticaiton.
    const { username, password } = req.body;
    try {
      // Check if there's a user with provided username.
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        return res.status(404).json({ OK: false, message: "User Not Found" });
      }
      // Verifying the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ OK: false, message: "Invalid password" });
      }
      // If the password is valid we create and return an auth token for this user.
      const token = jwt.sign(
        { id: user.id, username: user.username },
        Constants.secretKey,
        {
          expiresIn: "3d",
        }
      );
      return res.json({ token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ OK: false, message: "Internal Server Error" });
    }
  },
};
