const axios = require("axios");
const { Constants } = require("../constants");

// const NewsAPI = require("newsapi");
// const newsapi = new NewsAPI(Constants.newsAPIKey);

module.exports = {
  topHeadlines: async function (req, res) {
    try {
      const newsAPIEndpoint = "https://newsapi.org/v2/top-headlines";
      const params = {
        country: "us",
        category: "general",
        apiKey: Constants.newsAPIKey,
      };

      const response = await axios.get(newsAPIEndpoint, { params });
      const articles = response.data.articles;
      console.log(articles);
      return res.json(articles);
    } catch (error) {
      console.log(error);
      res.status(500).json({ OK: false, message: "Internal server error" });
    }
  },
  sportsTr: async function (req, res) {
    try {
      const newsAPIEndpoint = "https://newsapi.org/v2/top-headlines";
      const params = {
        country: req.body.country,
        category: req.body.category,
        pageSize: 100,
        apiKey: Constants.newsAPIKey,
      };
      const response = await axios.get(newsAPIEndpoint, { params });
      const articles = response.data.articles;
      console.log(articles);
      return res.json(articles);
    } catch (error) {
      console.log(error);
      res.status(500).json({ OK: false, message: "Internal server error" });
    }
  },
};
