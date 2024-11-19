const express = require("express");
const genresRoute = express.Router();
const genresController = require("../controllers/genresController");

genresRoute.get("/", genresController.getAllGenres);

genresRoute.post("/", genresController.createGenrePost);

genresRoute.get("/new", (req, res) => {
  res.render("genreForm");
});

genresRoute.get("/:name", genresController.findGenreByName);

genresRoute.post("/:name", genresController.addMovieToGenre);

genresRoute.get("/:name/new", (req, res) => {
  const { name } = req.params;
  if (!name || name.trim() === "") {
    // Redirect to genres list or show an error
    return res.redirect("/genres");
  }
  res.render("newMovie", { genre: { name } });
});

module.exports = genresRoute;
