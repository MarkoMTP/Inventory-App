const pool = require("./pool");

async function getAllGenres() {
  const results = await pool.query("SELECT * FROM genres");
  return results.rows;
}

async function createNewGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

module.exports = {
  createNewGenre,
  getAllGenres,
};
