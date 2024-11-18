const express = require("express");
const genresRoute = express.Router();
const genresController = require("../controllers/genresController");

genresRoute.get("/", genresController.getAllGenres);

genresRoute.post("/", genresController.createGenrePost);

genresRoute.get("/:name", genresController.findGenreByName);

genresRoute.get("/new", (req, res) => {
  res.render("genreForm");
});

module.exports = genresRoute;
