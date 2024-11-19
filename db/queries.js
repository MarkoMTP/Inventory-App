const pool = require("./pool");

async function getAllGenres() {
  const results = await pool.query("SELECT * FROM genres");
  return results.rows;
}

async function createNewGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name.trim()]);
}

async function findGenreByName(name) {
  try {
    const results = await pool.query(
      "SELECT * FROM genres WHERE name ILIKE $1",
      [name.trim()]
    );
    return results.rows[0]; // Return the first row or undefined if not found
  } catch (error) {
    console.error("Error fetching genre from database:", error.message);
    throw error;
  }
}

async function findGenreId(name) {
  try {
    const results = await pool.query(
      "SELECT id FROM genres WHERE name ILIKE $1",
      [name]
    );

    if (results.rows.length === 0) {
      console.error("Genre not found in the database.");
      return null; // Return `null` if no matching genre is found
    }

    return results.rows[0].id;
  } catch (error) {
    console.error("Error fetching genre from database:", error.message);
    throw error; // Re-throw the error to handle it in the caller
  }
}

async function findMovieId(title) {
  try {
    const results = await pool.query(
      "SELECT id FROM movies WHERE title ILIKE $1",
      [title]
    );

    if (results.rows.length === 0) {
      console.error("Movie not found in the database.");
      return null; // Return `null` if no matching movie is found
    }

    return results.rows[0].id;
  } catch (error) {
    console.error("Error fetching movie from database:", error.message);
    throw error; // Re-throw the error to handle it in the caller
  }
}

async function linkMovieToGenre(movieTitle, genreId) {
  try {
    const movieId = await findMovieId(movieTitle); // Find the movie ID based on the title

    if (!movieId) {
      console.error("Movie not found or invalid movie ID.");
      return;
    }

    // Check if the movie-genre combination already exists in the movies_genres table
    const result = await pool.query(
      "SELECT 1 FROM movie_genres WHERE movie_id = $1 AND genre_id = $2",
      [movieId, genreId]
    );

    if (result.rows.length > 0) {
      console.log("This movie is already linked to this genre.");
      return; // Exit if the movie is already linked to the genre
    }

    // If the movie is not already linked to the genre, insert the link
    await pool.query(
      "INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)",
      [movieId, genreId]
    );

    console.log("Movie successfully linked to genre.");
  } catch (error) {
    console.error("Error linking movie to genre:", error.message);
  }
}

async function findMoviesByGenreName(genreName) {
  try {
    const result = await pool.query(
      `SELECT m.title
       FROM movies m
       JOIN movie_genres mg ON m.id = mg.movie_id
       JOIN genres g ON g.id = mg.genre_id
       WHERE g.name = $1`,
      [genreName]
    );

    return result.rows; // This will be an array of movie titles
  } catch (error) {
    console.error("Error fetching movies for genre:", error.message);
    throw error;
  }
}

async function insertMovie(title, releaseYear, director, description) {
  try {
    const result = await pool.query(
      "INSERT INTO movies (title, release_year, director, description) VALUES ($1, $2, $3, $4) RETURNING id",
      [title, releaseYear, director, description]
    );
    console.log("Inserted movie with ID:", result.rows[0].id);
    return result.rows[0].id; // Return the newly inserted movie's ID
  } catch (error) {
    console.error("Error inserting movie into the database:", error.message);
    throw error;
  }
}

module.exports = {
  createNewGenre,
  getAllGenres,
  findGenreByName,
  findGenreId,
  findMovieId,
  linkMovieToGenre,
  findMoviesByGenreName,
  insertMovie,
};
