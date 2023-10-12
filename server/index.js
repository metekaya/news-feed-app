const express = require("express");
const PORT = 4000;
const app = express();
const cors = require("cors");

const sequelize = require("./connections/database");
const User = require("./models/user");

const users = require("./endpoints/users");
const { authenticateToken } = require("./middleware/auth");
const news = require("./endpoints/news");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

User.sync();

app.get("/", (req, res) => {
  res.send("running flawlessly");
});

app.get("/users", authenticateToken, users.readAllUsers);
app.get("/topHeadlines", authenticateToken, news.topHeadlines);
app.post("/topHeadlines", authenticateToken, news.sportsTr);
app.post("/sign-up", users.create);
app.post("/login", users.login);

app.listen(PORT, () =>
  console.log(`Server is now listening on http://localhost:${PORT}`)
);
