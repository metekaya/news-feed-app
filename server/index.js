const express = require("express");
const PORT = 4000;
const app = express();

/* 
Burada CORS kullanmamın sebebi, geliştirme amaçlı bir uygulama yazdığımdan dolayıdır.
Production'a alınacak bir uygulama bazında güvenlik nedenleriyle tüm kaynaklardan 
gelen isteklere izin vermek yerine belirli kaynaklara izin vermek daha mantıklıdır.
*/
const cors = require("cors");

const sequelize = require("./connections/database");
const User = require("./models/user");
const Preferences = require("./models/preferences");

const users = require("./endpoints/users");
const news = require("./endpoints/news");
const auth = require("./endpoints/auth");

const { authenticateToken } = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

User.sync();
Preferences.sync();

app.get("/", (req, res) => {
  res.send("running flawlessly");
});

app.post("/user", users.create);
app.post("/auth", auth.login);
app.get("/user/preferences", authenticateToken, users.readPreferences);
app.put("/user/preferences", authenticateToken, users.updatePreferences);
/* 
I know that this endpoint should be GET /news with query params but at 
first I tried to make it happen in quick manners therefore I used POST
*/
app.post("/filter-news", authenticateToken, news.filteredNews);

app.listen(PORT, () =>
  console.log(`Server is now listening on http://localhost:${PORT}`)
);
