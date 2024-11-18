const express = require("express");
const homepageRoute = express.Router();

const genresRoute = require("./genresRoute");

homepageRoute.get("/", (req, res) => {
  res.render("homePageView");
});

homepageRoute.use("/genres", genresRoute);

module.exports = homepageRoute;
