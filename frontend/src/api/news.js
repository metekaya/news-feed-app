import axios from "axios";

export async function getFilteredNews(userPreferences) {
  const response = axios.post(
    "http://localhost:4000/filter-news",
    {
      country: userPreferences.country,
      category: userPreferences.category,
      apiSource: userPreferences.apiSource,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response;
}
