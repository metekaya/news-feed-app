const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Constants } = require("../constants");

module.exports = {
  read: async function (req, res) {
    const userId = req.params.id;
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      console.log(`User not found error for the id = ${userId}`);
      return res.status(404).json({ OK: false, message: "User Not Found" });
    }
    console.log(`User found for the id = ${userId}`);
    return res.json(user);
  },
  readAllUsers: async function (req, res) {
    const users = await User.findAll();
    console.log(`Returning all users = ${users}`);
    return res.json({ data: users });
  },
  create: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Starting to create user = ${username}`);
    //check if username exists
    const existingUser = await User.findOne({
      where: { username },
    });
    if (existingUser) {
      console.log("Username is already in use");
      return res
        .status(400)
        .json({ OK: false, message: "Username is already in use" });
    }
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });
      console.log(`Successfully created new user = ${username}`);
      return res.json(newUser);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ OK: false, message: "Internal Server Error" });
    }
  },
  login: async function (req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      console.log(`Trying to login for ${username}`);

      const user = await User.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({ OK: false, message: "User Not Found" });
      }
      //Verifying the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ OK: false, message: "Invalid password" });
      }

      const token = jwt.sign({ username: user.username }, Constants.secretKey, {
        expiresIn: "1h",
      });

      return res.json({ token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ OK: false, message: "Internal Server Error" });
    }
  },
};
