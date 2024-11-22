const db = require("../db/queries");
const genresRoute = require("../routes/genresRoute");

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
    const movieId = await db.findMovieId(title);
    await db.linkMovieToGenre(movieId, genreId);
    res.redirect(`/genres/${genreName}`); // Redirect instead of rendering directly
  } catch (error) {
    console.error("Error occurred:", error.message);
    res
      .status(500)
      .send("An error occurred while adding the movie to the genre.");
  }
};

exports.getMovieDetails = async (req, res) => {
  const { title: movieTitle, name: genreName } = req.params; // Destructure parameters from the URL

  try {
    // Fetch movie details by title
    const movie = await db.findMovieByName(movieTitle);

    if (!movie) {
      // If no movie is found, return a 404 status with a descriptive message
      return res.status(404).json({ error: "Movie not found" });
    }

    // Render the view with the movie details and genre
    return res.render("movieDetails", { genre: { name: genreName }, movie }); // Pass movie and genre to the view
  } catch (error) {
    console.error("Error fetching movie details:", error);

    // Return a generic 500 error with a helpful message
    return res.status(500).json({
      error:
        "An error occurred while fetching the movie details. Please try again later.",
    });
  }
};

exports.deleteMovie = async (req, res) => {
  const { title: movieTitle, name: genreName } = req.params; // Only destructure the movie title

  try {
    // Step 1: Fetch movieId by title
    const movieId = await db.findMovieId(movieTitle);

    // Step 2: Remove the movie (and its associations)

    await db.removeMovie(movieId);

    // Step 3: Send a success response
    return res.redirect(`/genres/${genreName}`);
  } catch (error) {
    console.error("Error deleting movie:", error); // Log the full error for better debugging
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the movie." });
  }
};

exports.deleteGenres = async (req, res) => {
  const movies = await db.findMoviesByGenreName(req.params.name);
  const genreId = await db.findGenreId(req.params.name);
  if (movies.length > 0) {
    console.error("genre can be deleted only when there is no movies");
    res.redirect(`/genres/${req.params.name}`);
  } else {
    await db.deleteGenre(genreId);
    console.log("successfully deleted genre");
    res.redirect("/genres");
  }
};
