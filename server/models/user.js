const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

// User model, I kept it simple because we don't need unnecessary information in our case
const User = sequelize.define("users", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(64),
    allowNull: false,
  },
});

module.exports = User;
