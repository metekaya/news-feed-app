import axios from "axios";

export async function createAccount(user) {
  const response = axios.post("http://localhost:4000/user", {
    username: user.username,
    password: user.password,
  });
  return response;
}

export async function login(user) {
  const response = await axios.post("http://localhost:4000/auth", {
    username: user.username,
    password: user.password,
  });

  window.localStorage.setItem("token", response.data.token);
  return response;
}

export async function getPreferences() {
  const response = await axios.get("http://localhost:4000/user/preferences", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response;
}

export async function updatePreferences(userPreferences) {
  const response = await axios.put(
    "http://localhost:4000/user/preferences",
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
