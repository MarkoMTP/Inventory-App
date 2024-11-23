const { Client } = require("pg");
require("dotenv").config();

const SQL = `
INSERT INTO genres (name) 
VALUES
  ('Adventure'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Drama'),
  ('Fantasy'),
  ('Horror'),
  ('Romance'),
  ('Sci-Fi');
`;

async function main() {
  console.log("seeding genres...");
  const client = new Client({
    connectionString: process.env.SUPABASE_URL, // You can replace this with your Supabase URL
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Genres seeded successfully.");
  } catch (error) {
    console.error("Error seeding genres:", error);
  } finally {
    await client.end();
  }
}

main();
