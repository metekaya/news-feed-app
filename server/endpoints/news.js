const axios = require("axios");
const { Constants } = require("../constants");

// Function to call NewsAPI endpoint and get desired results with desired format.
const newsAPINews = async function (country, category) {
  const newsAPIEndpoint = "https://newsapi.org/v2/top-headlines";
  /* 
  We make this check here because NewsAPI accepts ISO country codes
  whereas the GuardianAPI accepts ISO language codes.
  */
  country = country === "en" ? "us" : country;
  // Desired params from user to get the news.
  const params = {
    category,
    country,
    pageSize: 40,
    apiKey: Constants.newsAPIKey,
  };

  try {
    const response = await axios.get(newsAPIEndpoint, { params });
    const articles = response.data.articles;

    /* 
    This is the unified object structure that I've created.
    I want to return only these data with these keys. Later we'll be
    using the same structure with GuardianAPI.
    */
    return articles.map((article) => ({
      title: article.title,
      publishedAt: article.publishedAt,
      author: article.author,
      source: article.source.name,
      url: article.url,
      urlToImage: article.urlToImage,
      apiSource: "NewsAPI", // Manually added api source to filter
    }));
  } catch (error) {
    console.log(error);
  }
};

const guardianAPINews = async function (country, category) {
  const guardianEndpoint = `https://content.guardianapis.com/search`;
  // Desired params from user to get the news.
  const params = {
    q: category,
    lang: country,
    "page-size": 40,
    "api-key": Constants.guardianAPIKey,
  };

  try {
    const response = await axios.get(guardianEndpoint, { params });
    /* 
    Apply the same unified object structure for GuardianAPI as well.
    We have some keys that this API does not provide for us so we'll 
    be using generic values for them.
    */
    return response.data.response.results.map((article) => ({
      title: article.webTitle,
      publishedAt: article.webPublicationDate,
      author: "anonymous", // API does not provides "author"
      source: "general", // API does not provides "source"
      url: article.webUrl,
      urlToImage: null, // API does not provides an image
      apiSource: "GuardianAPI", // Manually added api source to filter
    }));
  } catch (error) {
    console.log(error);
  }
};

/*
So this part is a little bit complicated, with these helper functions
we make the apiSource filtering. For example if the user wants to see the 
news from only GuardianAPI we'll only make call to GuardianAPI.
*/

// An object for the apiSource: "NewsAPI" or "GuardianAPI"
const apiCallFunctions = {
  NewsAPI: (country, category) => newsAPINews(country, category),
  GuardianAPI: (country, category) => guardianAPINews(country, category),
};

// Function for concating the desired results to one unified response array.
const getFunctionResponses = async (country, category) => {
  let responseArray = [];
  /* 
  If only "NewsAPI" requested, this for loop will run once and return 
  only NewsAPI news. If "all" is requested will run twice and get both 
  results then it will concat them to each other.
  */
  for (const key in apiCallFunctions) {
    const response = await apiCallFunctions[key](country, category);
    responseArray = [...responseArray, ...response];
  }
  return responseArray;
};

// Final part of the process. If "all" requested run getFunctionResponses.
// If not only run requested source
const handleFilters = async (apiSource, country, category) => {
  if (apiCallFunctions[apiSource]) {
    return await apiCallFunctions[apiSource](country, category);
  } else {
    return await getFunctionResponses(country, category);
  }
};

module.exports = {
  // Endpoint for returning the desired/filtered news data.
  filteredNews: async function (req, res) {
    const { country, category, apiSource } = req.body;

    try {
      const response = await handleFilters(apiSource, country, category);
      return res.json(response);
    } catch (error) {
      console.error("Error fetching and filtering API responses:", error);
      res.status(500).json({ OK: false, message: "Internal server error" });
    }
  },
};
