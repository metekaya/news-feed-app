const bcrypt = require("bcrypt");

const { Constants } = require("../constants");

const sequelize = require("../connections/database");
const User = require("../models/user");
const Preferences = require("../models/preferences");

module.exports = {
  //Endpoint for account creation.
  create: async function (req, res) {
    /*
    We'll use transaction for this call because if any of the
    steps fail we don't want to save or create any record.
    */
    const transaction = await sequelize.transaction();

    const { username, password } = req.body;
    console.log(`Starting to create user = ${username}`);
    // Check if username exists.
    const existingUser = await User.findOne({
      where: { username },
    });
    if (existingUser) {
      console.log("Username is already in use");
      return res
        .status(400)
        .json({ OK: false, message: "Username is already in use" });
    }
    // Hash the password for security.
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create user with provided data.
      const newUser = await User.create(
        {
          username,
          password: hashedPassword,
        },
        { transaction: transaction }
      );
      // We'll assign default preferences to each user.
      const userPreferences = await Preferences.create(
        {
          country: "en",
          category: "general",
          apiSource: "all",
          userId: newUser.id,
        },
        { transaction: transaction }
      );
      // If we reached here we commit the changes/updates/creations.
      await transaction.commit();
      console.log(`Successfully created new user = ${username}`);
      return res.json(newUser);
    } catch (error) {
      /* 
      If we encounter any problems within any step we rollback
      every change/update/creation.
      */
      await transaction.rollback();
      console.log(error);
      return res
        .status(500)
        .json({ OK: false, message: "Internal Server Error" });
    }
  },
  // Endpoint for getting the user preferences.
  readPreferences: async function (req, res) {
    const userId = req.user.id;
    try {
      const userPreferences = await Preferences.findOne({ where: { userId } });

      if (userPreferences) {
        return res.json(userPreferences.dataValues);
      } else {
        return res.status(404).json({ error: "User preferences not found" });
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  // Endpoint for updating and saving user preferences.
  updatePreferences: async function (req, res) {
    const userId = req.user.id;
    const { country, category, apiSource } = req.body;

    try {
      const userPreferences = await Preferences.findOne({ where: { userId } });
      // Initialize user preferences with the requested data.
      userPreferences.country = country;
      userPreferences.category = category;
      userPreferences.apiSource = apiSource;

      await userPreferences.save();
      console.log("Successfully updated user preferences.");
      // Return new user preferences to frontend.
      return res.json(userPreferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
