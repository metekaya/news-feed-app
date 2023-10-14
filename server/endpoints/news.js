const axios = require("axios");
const { Constants } = require("../constants");

const newsAPINews = async function (country, category) {
  const newsAPIEndpoint = "https://newsapi.org/v2/top-headlines";
  country = country === "en" ? "us" : country;
  try {
    const params = {
      country,
      category,
      pageSize: 40,
      apiKey: Constants.newsAPIKey,
    };
    const response = await axios.get(newsAPIEndpoint, { params });
    const articles = response.data.articles;

    return articles.map((article) => ({
      title: article.title,
      publishedAt: article.publishedAt,
      author: article.author,
      source: article.source.name,
      url: article.url,
      urlToImage: article.urlToImage,
      apiSource: "NewsAPI",
    }));
  } catch (error) {
    console.log(error);
  }
};

const guardianAPINews = async function (country, category) {
  const guardianEndpoint = `https://content.guardianapis.com/search`;
  try {
    const response = await axios.get(guardianEndpoint, {
      params: {
        q: category,
        "api-key": Constants.guardianAPIKey,
        "page-size": 40,
        lang: country,
      },
    });
    return response.data.response.results.map((article) => ({
      title: article.webTitle,
      publishedAt: article.webPublicationDate,
      author: "anonymous",
      source: "general",
      url: article.webUrl,
      urlToImage: null,
      apiSource: "GuardianAPI",
    }));
  } catch (error) {
    console.log(error);
  }
};

const apiSourceFunctions = {
  NewsAPI: (country, category) => newsAPINews(country, category),
  GuardianAPI: (country, category) => guardianAPINews(country, category),
};

const getAllFunctionsResponse = async (country, category) => {
  let responseArray = [];
  for (const key in apiSourceFunctions) {
    const response = await apiSourceFunctions[key](country, category);
    responseArray = [...responseArray, ...response];
  }
  return responseArray;
};

const handleRequest = async (requestedFunction, country, category) => {
  if (requestedFunction) {
    if (apiSourceFunctions[requestedFunction]) {
      return await apiSourceFunctions[requestedFunction](country, category);
    } else {
      return await getAllFunctionsResponse(country, category);
    }
  }
};

module.exports = {
  mergedNews: async function (req, res) {
    const country = req.body.country;
    const category = req.body.category;
    const apiSource = req.body.apiSource;

    try {
      const response = await handleRequest(apiSource, country, category);
      return res.json(response);
    } catch (error) {
      console.error("Error fetching and merging API responses:", error);
      res.status(500).json({ OK: false, message: "Internal server error" });
    }
  },
};
