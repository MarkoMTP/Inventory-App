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

async function findMoviesByGenreName(genreName) {
  try {
    const result = await pool.query(
      `SELECT m.id, m.title, m.release_year, m.director, m.description
       FROM movies m
       JOIN movie_genres mg ON m.id = mg.movie_id
       JOIN genres g ON g.id = mg.genre_id
       WHERE g.name ILIKE $1`, // Use ILIKE for case-insensitive match
      [genreName]
    );
    return result.rows; // Return an array of movie details
  } catch (error) {
    console.error(
      `Error fetching movies for genre "${genreName}":`,
      error.message
    );
    throw error;
  }
}

async function linkMovieToGenre(movieId, genreId) {
  try {
    await pool.query(
      "INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)",
      [movieId, genreId]
    );
    console.log("Movie successfully linked to genre.");
  } catch (error) {
    if (error.code === "23505") {
      console.log("This movie is already linked to this genre."); // Unique constraint violation
    } else {
      console.error("Error linking movie to genre:", error.message);
      throw error;
    }
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

async function findMovieByName(movieTitle) {
  try {
    const result = await pool.query("SELECT * FROM movies WHERE title = $1", [
      movieTitle,
    ]);
    return result.rows[0]; // Return the first row (movie details)
  } catch (error) {
    console.error("Error fetching movie by title:", error.message);
    throw error; // Re-throw the error for handling in the caller
  }
}

async function removeMovie(movieId) {
  try {
    // Step 1: Remove the movie-genre association
    await pool.query(`DELETE FROM movie_genres WHERE movie_id = $1`, [movieId]);

    // Step 2: Delete the movie from the movies table
    await pool.query(
      `DELETE FROM movies WHERE id = $1`,
      [movieId] // Passing movieId as a parameter
    );

    console.log(`Movie with ID ${movieId} successfully deleted`);
  } catch (error) {
    console.error("Error removing movie:", error.message);
    throw new Error("An error occurred while removing the movie.");
  }
}

async function deleteGenre(genreId) {
  try {
    await pool.query(`DELETE FROM genres WHERE id = $1`, [genreId]);
    console.log("genre succesfully deleted");
  } catch (error) {
    console.error("Error removing genres:", error.message);
    throw new Error("An error occurred while removing the genre.");
  }
}

module.exports = {
  deleteGenre,
  createNewGenre,
  getAllGenres,
  findGenreByName,
  findGenreId,
  findMovieId,
  linkMovieToGenre,
  findMoviesByGenreName,
  insertMovie,
  findMovieByName,
  removeMovie,
};
