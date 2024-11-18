const express = require("express");
const app = express();
app.set("view engine", "ejs");
const path = require("node:path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

// routers
const homepageRoute = require("./routes/homePageRoute");

app.use("/", homepageRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
