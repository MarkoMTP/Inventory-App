const db = require("../db/queries");

exports.getAllGenres = async (req, res) => {
  try {
    const results = await db.getAllGenres();
    console.log(results);
    // Wait for the results
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
