const { Pool } = require("pg");
require("dotenv").config();

// Assuming your pool is already configured correctly
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL, // Replace with your Supabase URL
});

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

async function seedMovies() {
  const movieGenres = {
    Action: 1,
    Superhero: 2,
    Animation: 3,
    Crime: 4,
    Drama: 5,
    "Sci-Fi": 6,
    Horror: 7,
    Romance: 8,
    Adventure: 9,
  };

  // List of movies to add
  const movies = [
    {
      title: "Die Hard",
      releaseYear: 1988,
      director: "John McTiernan",
      description:
        "A New York cop battles terrorists who have hijacked a Los Angeles skyscraper.",
      genres: ["Action"],
    },
    {
      title: "The Dark Knight",
      releaseYear: 2008,
      director: "Christopher Nolan",
      description:
        "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham City into anarchy.",
      genres: ["Action", "Superhero"],
    },
    {
      title: "Toy Story",
      releaseYear: 1995,
      director: "John Lasseter",
      description:
        "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
      genres: ["Animation"],
    },
    {
      title: "The Godfather",
      releaseYear: 1972,
      director: "Francis Ford Coppola",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      genres: ["Crime", "Drama"],
    },
    {
      title: "The Shawshank Redemption",
      releaseYear: 1994,
      director: "Frank Darabont",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      genres: ["Drama"],
    },
    {
      title: "Inception",
      releaseYear: 2010,
      director: "Christopher Nolan",
      description:
        "A thief who enters the dreams of others to steal secrets from their subconscious is given the inverse task of planting an idea into the mind of a CEO.",
      genres: ["Sci-Fi", "Action"],
    },
    {
      title: "Avengers: Endgame",
      releaseYear: 2019,
      director: "Anthony Russo, Joe Russo",
      description:
        "After the devastating events of Infinity War, the Avengers must assemble to undo Thanos's snap and save the universe.",
      genres: ["Action", "Sci-Fi"],
    },
    {
      title: "The Conjuring",
      releaseYear: 2013,
      director: "James Wan",
      description:
        "Paranormal investigators work to help a family terrorized by a dark presence in their farmhouse.",
      genres: ["Horror"],
    },
    {
      title: "The Notebook",
      releaseYear: 2004,
      director: "Nick Cassavetes",
      description:
        "A young couple falls in love during the early years of World War II, but they are separated by the ravages of time and war.",
      genres: ["Romance", "Drama"],
    },
    {
      title: "The Lord of the Rings: The Fellowship of the Ring",
      releaseYear: 2001,
      director: "Peter Jackson",
      description:
        "A young hobbit is tasked with the destruction of a powerful ring that could bring about the end of the world.",
      genres: ["Adventure", "Fantasy"],
    },
  ];

  // Seed movies and link them to genres
  for (const movie of movies) {
    try {
      // Insert the movie into the database
      const movieId = await insertMovie(
        movie.title,
        movie.releaseYear,
        movie.director,
        movie.description
      );

      // Link the movie to its genres
      for (const genre of movie.genres) {
        const genreId = movieGenres[genre];
        if (genreId) {
          await linkMovieToGenre(movieId, genreId);
        } else {
          console.log(`Genre not found for ${genre}`);
        }
      }
    } catch (error) {
      console.error("Error seeding movie:", error.message);
    }
  }
}

async function main() {
  await seedMovies();
  console.log("Seeding complete!");
}

main();
