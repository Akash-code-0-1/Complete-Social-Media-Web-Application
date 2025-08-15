// connect.js
import mysql from "mysql2";

// Create the database connection
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akash360@", // Change this if your MySQL password is different
  database: "social",
});

// Connect and log any issues
db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});
