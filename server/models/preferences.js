const sequelize = require("../connections/database");
const Sequelize = require("sequelize");
const User = require("./user");

const Preferences = sequelize.define("preferences", {
  country: Sequelize.STRING,
  category: Sequelize.STRING,
  apiSource: Sequelize.STRING,
});

User.hasOne(Preferences);
Preferences.belongsTo(User);

module.exports = Preferences;
