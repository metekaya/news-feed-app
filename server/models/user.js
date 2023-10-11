const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

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
