const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "metro_events",
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// Endpoint - register
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Invalid request. Missing username, email, or password.",
    });
  }

  // Check if username or email already exists
  const checkUserExistsQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ? OR email = ?";
  db.query(checkUserExistsQuery, [username, email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).json({ message: "Error registering user" });
    }
    const { count } = result[0];
    if (count > 0) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // If username and email are unique, proceed with registration
    const insertUserQuery = "INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, 'user', 'active')";
    db.query(insertUserQuery, [username, email, password], (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      console.log("User registered successfully");
      return res.status(200).json({ message: "User registered successfully" });
    });
  });
});

// Endpoint - log-in
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid request. Missing username or password.",
    });
  }
  
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ message: "Error logging in" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // At this point, login is successful
    return res.status(200).json({ message: "Login successful", user });
  });
});



app.listen(8081, () => {
  console.log("Listening on port 8081");
});
