const db = require("../db/queries");

exports.getAllGenres = async (req, res) => {
  try {
    const results = await db.getAllGenres();
    res.render("genresView", { genres: results }); // Pass the data to the view
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("An error occurred while fetching genres.");
  }
};

exports.createGenrePost = async (req, res) => {
  const { name } = req.body;
  await db.createNewGenre(name);
  res.redirect("/genres");
};

exports.findGenreByName = async (req, res) => {
  try {
    const genreName = req.params.name; // Do not parseInt since name is likely a string
    const genre = await db.findGenreByName(genreName); // Await the async function

    if (!genre) {
      return res.status(404).send("Genre not found");
    }

    res.render("genreDetails", { genre: genre, movies: "" });
  } catch (error) {
    console.error("Error fetching genre by name:", error.message);
    res.status(500).send("An error occurred while fetching the genre.");
  }
};
