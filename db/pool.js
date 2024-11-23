require("dotenv").config(); // Ensure dotenv is installed and required
const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: process.env.SUPABASE_URL,
});
