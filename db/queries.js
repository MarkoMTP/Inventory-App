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

module.exports = {
  createNewGenre,
  getAllGenres,
  findGenreByName,
};
