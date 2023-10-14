const config = require("./config.json");

exports.Constants = {
  secretKey: config.secretKey,
  newsAPIKey: config.newsAPIKey,
  guardianAPIKey: config.guardianAPIKey,
};
