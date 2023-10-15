const sequelize = require("../connections/database");
const Sequelize = require("sequelize");
const User = require("./user");

// Preferences model for user preferences. Could be extended, of course.
const Preferences = sequelize.define("preferences", {
  country: Sequelize.STRING,
  category: Sequelize.STRING,
  apiSource: Sequelize.STRING,
});
// Make OneToOne relation to user model because we want every user to have one Preference.
User.hasOne(Preferences);
Preferences.belongsTo(User);

module.exports = Preferences;
