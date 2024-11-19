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
    const genreName = req.params.name;
    const movies = await db.findMoviesByGenreName(genreName);
    // Do not parseInt since name is likely a string
    const genre = await db.findGenreByName(genreName); // Await the async function

    if (!genre) {
      console.error("Genre not found.");
      return res.redirect("/genres"); // Redirect to genres list if genre not found
    }

    movies.forEach((movie) => {
      console.log(movie.release_year);
    });

    res.render("genreDetails", { genre: genre, movies: movies });
  } catch (error) {
    console.error("Error fetching genre by name:", error.message);
    res.status(500).send("An error occurred while fetching the genre.");
  }
};

//creates a new movie and adds it automatically to new Genre
exports.addMovieToGenre = async (req, res) => {
  const genreName = req.params.name;
  const { title, releaseYear, director, description } = req.body;

  try {
    await db.insertMovie(title, releaseYear, director, description);

    const genreId = await db.findGenreId(genreName);
    if (!genreId) {
      return res.status(404).send("Genre not found");
    }

    await db.linkMovieToGenre(title, genreId);
    res.redirect(`/genres/${genreName}`); // Redirect instead of rendering directly
  } catch (error) {
    console.error("Error occurred:", error.message);
    res
      .status(500)
      .send("An error occurred while adding the movie to the genre.");
  }
};
