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
  const checkUserExistsQuery =
    "SELECT COUNT(*) AS count FROM users WHERE username = ? OR email = ?";
  db.query(checkUserExistsQuery, [username, email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).json({ message: "Error registering user" });
    }
    const { count } = result[0];
    if (count > 0) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // If username and email are unique, proceed with registration
    const insertUserQuery =
      "INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, 'user', 'active')";
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

// Endpoint to fetch all user IDs
app.get("/api/users", (req, res) => {
  // SQL query to retrieve all user IDs
  const sql = "SELECT user_id FROM Users";

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching user IDs:", err);
      return res.status(500).json({ message: "Error fetching user IDs" });
    }

    // Send the retrieved user IDs as JSON response
    return res.status(200).json(results);
  });
});


// Endpoint to fetch user by username
app.get("/user/:username", (req, res) => {
  const { username } = req.params;
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = results[0];
    return res.status(200).json(user);
  });
});

// Endpoint to fetch user by userId
app.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM users WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = results[0];
    return res.status(200).json(user);
  });
});

// fetch event by eventid
app.get("/api/events/:eventId", (req, res) => {
  const eventId = req.params.eventId;
  // Query the database to retrieve the event with the specified eventId
  db.query(
    "SELECT * FROM Events WHERE event_id = ?",
    [eventId],
    (err, result) => {
      if (err) {
        console.error("Error fetching event:", err);
        return res.status(500).json({ message: "Error fetching event" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      // Send the event as a JSON response
      res.json(result[0]);
    }
  );
});

// fetch reviews by event_id
app.get("/reviews/:event_id", (req, res) => {
  const eventId = req.params.event_id;
  // SQL query to join Reviews and Users tables
  const sqlQuery = `
      SELECT Reviews.review_id, Reviews.event_id, Reviews.user_id, Reviews.rating, Reviews.comment, Users.username
      FROM Reviews
      INNER JOIN Users ON Reviews.user_id = Users.user_id
      WHERE Reviews.event_id = ?`;

  // Execute the query
  db.query(sqlQuery, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Failed to fetch reviews" });
    } else {
      res.json(results);
    }
  });
});

// post review
// Endpoint to handle posting reviews
app.post("/api/post-review", (req, res) => {
  const { event_id, user_id, rating, comment } = req.body;

  // Validate input data
  if (!event_id || !user_id || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // SQL query to insert the review into the database
  const sqlQuery =
    "INSERT INTO Reviews (event_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";

  // Execute the query
  db.query(sqlQuery, [event_id, user_id, rating, comment], (err, results) => {
    if (err) {
      console.error("Error posting review:", err);
      res.status(500).json({ error: "Failed to post review" });
    } else {
      res.status(201).json({ message: "Review posted successfully." });
    }
  });
});

// upvotes
// Endpoint to handle posting upvotes
app.post("/api/upvotes", (req, res) => {
  const { user_id, event_id } = req.body;

  // Validate input data
  if (!user_id || !event_id) {
    return res
      .status(400)
      .json({ error: "User ID and event ID are required." });
  }

  // SQL query to insert the upvote into the database
  const sqlQuery = "INSERT INTO Upvotes (user_id, event_id) VALUES (?, ?)";

  // Execute the query
  db.query(sqlQuery, [user_id, event_id], (err, results) => {
    if (err) {
      console.error("Error adding upvote:", err);
      res.status(500).json({ error: "Failed to add upvote" });
    } else {
      res.status(201).json({ message: "Upvote added successfully." });
    }
  });
});

// remove upvote, delete upvote
// Endpoint to handle deleting upvotes
app.post("/api/remove-upvotes", (req, res) => {
  const { user_id, event_id } = req.body;

  // Validate input data
  if (!user_id || !event_id) {
    return res
      .status(400)
      .json({ error: "User ID and event ID are required." });
  }

  // SQL query to delete the upvote from the database
  const sqlQuery = "DELETE FROM Upvotes WHERE user_id = ? AND event_id = ?";

  // Execute the query
  db.query(sqlQuery, [user_id, event_id], (err, results) => {
    if (err) {
      console.error("Error deleting upvote:", err);
      res.status(500).json({ error: "Failed to delete upvote" });
    } else {
      if (results.affectedRows === 0) {
        // If no rows were affected, it means the upvote doesn't exist
        res.status(404).json({ error: "Upvote not found." });
      } else {
        res.status(200).json({ message: "Upvote deleted successfully." });
      }
    }
  });
});

// is upvoting, specific user upvote
// Endpoint to check if a user is currently upvoting
app.get("/api/is-upvoting/:user_id/:event_id", (req, res) => {
  const { user_id, event_id } = req.params;

  // Validate input data
  if (!user_id || !event_id) {
    return res
      .status(400)
      .json({ error: "User ID and event ID are required." });
  }

  // SQL query to check if the user is currently upvoting the event
  const sqlQuery =
    "SELECT COUNT(*) AS count FROM Upvotes WHERE user_id = ? AND event_id = ?";

  // Execute the query
  db.query(sqlQuery, [user_id, event_id], (err, results) => {
    if (err) {
      console.error("Error checking upvote status:", err);
      res.status(500).json({ error: "Failed to check upvote status" });
    } else {
      // If count is greater than 0, it means the user is currently upvoting the event
      const isUpvoting = results[0].count > 0;
      res.json({ isUpvoting });
    }
  });
});

// count vote
// Endpoint to count overall upvotes
app.get("/api/upvotes/count", (req, res) => {
  const eventId = req.query.event_id; // Extract the event_id from the request query
  console.info(eventId);

  // SQL query to count upvotes for the specified event ID
  const sqlQuery =
    "SELECT COUNT(*) AS totalUpvotes FROM Upvotes WHERE event_id = ?";

  // Execute the query with eventId as parameter
  db.query(sqlQuery, [eventId], (err, results) => {
    if (err) {
      console.error("Error counting upvotes:", err);
      res.status(500).json({ error: "Failed to count upvotes" });
    } else {
      const totalUpvotes = results[0].totalUpvotes;
      res.status(200).json({ totalUpvotes });
    }
  });
});

// method 2
// app.get("/api/upvotes/count", (req, res) => {
//   // SQL query to count overall upvotes
//   const sqlQuery = "SELECT COUNT(*) AS totalUpvotes FROM Upvotes";

//   // Execute the query
//   db.query(sqlQuery, (err, results) => {
//     if (err) {
//       console.error("Error counting upvotes:", err);
//       res.status(500).json({ error: "Failed to count upvotes" });
//     } else {
//       const totalUpvotes = results[0].totalUpvotes;
//       res.status(200).json({ totalUpvotes });
//     }
//   });
// });

// request to become organizer, request organizer
// Endpoint to handle requests to become an organizer
app.post("/api/request-organizer", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "Invalid request. Missing user ID.",
    });
  }

  // Check if there is an existing pending request for the user
  const checkExistingRequestQuery =
    "SELECT * FROM Requests WHERE user_id = ? AND status = 'pending'";
  db.query(checkExistingRequestQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking existing request:", err);
      return res
        .status(500)
        .json({ message: "Error checking existing request" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "There is already a pending request for this user" });
    }

    // If there is no pending request, insert the new request
    const insertRequestQuery =
      "INSERT INTO Requests (user_id, request_type, status) VALUES (?, ?, 'pending')";

    // Assuming the request_type is 'organizer' for this example
    db.query(insertRequestQuery, [userId, "organizer"], (err, result) => {
      if (err) {
        console.error("Error creating request to become an organizer:", err);
        return res.status(500).json({ message: "Error creating request" });
      }
      console.log("Request to become an organizer created successfully");
      return res.status(200).json({ message: "Request created successfully" });
    });
  });
});

// request admin
app.post("/api/request-administrator", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "Invalid request. Missing user ID.",
    });
  }

  // Check if there is an existing pending request for the user
  const checkExistingRequestQuery =
    "SELECT * FROM Requests WHERE user_id = ? AND status = 'pending'";
  db.query(checkExistingRequestQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking existing request:", err);
      return res
        .status(500)
        .json({ message: "Error checking existing request" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "There is already a pending request for this user" });
    }

    // If there is no pending request, insert the new request
    const insertRequestQuery =
      "INSERT INTO Requests (user_id, request_type, status) VALUES (?, ?, 'pending')";

    // Assuming the request_type is 'administrator' for this example
    db.query(insertRequestQuery, [userId, "administrator"], (err, result) => {
      if (err) {
        console.error(
          "Error creating request to become an administrator:",
          err
        );
        return res.status(500).json({ message: "Error creating request" });
      }
      console.log("Request to become an administrator created successfully");
      return res.status(200).json({ message: "Request created successfully" });
    });
  });
});

// Endpoint to fetch all upcoming active events
app.get("/api/upcoming-events", (req, res) => {
  // Get the current date
  const currentDate = new Date().toISOString().split("T")[0];

  // SQL query to retrieve upcoming active events
  const sql =
    "SELECT * FROM Events WHERE date >= ? AND status = 'active' ORDER BY date ASC";

  // Execute the query
  db.query(sql, [currentDate], (err, results) => {
    if (err) {
      console.error("Error fetching upcoming events:", err);
      return res
        .status(500)
        .json({ message: "Error fetching upcoming events" });
    }

    // Send the retrieved events as JSON response
    return res.status(200).json(results);
  });
});

// Endpoint to fetch registered events for a specific user
app.get("/api/registered-events/:userId", (req, res) => {
  // Extract the user ID from the request parameters
  const userId = req.params.userId;

  // SQL query to retrieve registered events for the user
  const sql =
    "SELECT * FROM Events INNER JOIN Participants ON Events.event_id = Participants.event_id WHERE Participants.user_id = ? AND Events.status = 'active'";

  // Execute the query
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching registered events:", err);
      return res
        .status(500)
        .json({ message: "Error fetching registered events" });
    }

    // Send the retrieved events as JSON response
    return res.status(200).json(results);
  });
});

// Endpoint to fetch event request status for a specific user and event
app.get("/api/event-request-status/:eventId/:userId", (req, res) => {
  // Extract the event ID and user ID from the request parameters
  const eventId = req.params.eventId;
  const userId = req.params.userId;

  // SQL query to retrieve event request status for the user and event
  const sql =
    "SELECT status FROM Event_Requests WHERE event_id = ? AND user_id = ?";

  // Execute the query
  db.query(sql, [eventId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching event request status:", err);
      return res
        .status(500)
        .json({ message: "Error fetching event request status" });
    }

    if (results.length === 0) {
      // If no status is found for the user and event, return 'pending'
      return res.status(200).json({ status: "unknown" });
    }

    // Send the retrieved status as JSON response
    return res.status(200).json(results[0]);
  });
});

// Endpoint to handle event participation requests
app.post("/api/event-requests", (req, res) => {
  const { event_id, user_id } = req.body;

  // Validate the incoming data
  if (!event_id || !user_id) {
    return res
      .status(400)
      .json({ message: "Invalid request. Missing event ID or user ID." });
  }

  // Check if the event exists
  const checkEventQuery = "SELECT * FROM Events WHERE event_id = ?";
  db.query(checkEventQuery, [event_id], (err, eventResults) => {
    if (err) {
      console.error("Error checking event existence:", err);
      return res
        .status(500)
        .json({ message: "Error checking event existence" });
    }

    if (eventResults.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user exists
    const checkUserQuery = "SELECT * FROM Users WHERE user_id = ?";
    db.query(checkUserQuery, [user_id], (err, userResults) => {
      if (err) {
        console.error("Error checking user existence:", err);
        return res
          .status(500)
          .json({ message: "Error checking user existence" });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user has already submitted a request for this event
      const checkRequestQuery =
        "SELECT * FROM event_requests WHERE event_id = ? AND user_id = ?";
      db.query(
        checkRequestQuery,
        [event_id, user_id],
        (err, requestResults) => {
          if (err) {
            console.error("Error checking event request:", err);
            return res
              .status(500)
              .json({ message: "Error checking event request" });
          }

          if (requestResults.length > 0) {
            return res.status(400).json({
              message: "You have already submitted a request for this event",
            });
          }

          // Insert the event request into the event_requests table
          const insertRequestQuery =
            "INSERT INTO event_requests (event_id, user_id, status) VALUES (?, ?, 'pending')";
          db.query(
            insertRequestQuery,
            [event_id, user_id],
            (err, insertResults) => {
              if (err) {
                console.error("Error inserting event request:", err);
                return res
                  .status(500)
                  .json({ message: "Error inserting event request" });
              }

              console.log("Event request stored successfully");
              return res
                .status(201)
                .json({ message: "Event request stored successfully" });
            }
          );
        }
      );
    });
  });
});

// post event
// Endpoint to handle posting an event by an organizer
app.post("/api/post-event", (req, res) => {
  const { organizer_id, title, description, type, date, location } = req.body;

  // Validate the incoming data
  if (!organizer_id || !title || !date || !location) {
    return res
      .status(400)
      .json({ message: "Invalid request. Missing required fields." });
  }

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error posting event" });
    }

    // Insert the event into the Events table
    const insertEventQuery =
      "INSERT INTO Events (organizer_id, title, description, type, date, location, status) VALUES (?, ?, ?, ?, ?, ?, 'active')";
    db.query(
      insertEventQuery,
      [organizer_id, title, description, type, date, location],
      (err, result) => {
        if (err) {
          console.error("Error posting event:", err);
          // Rollback transaction on error
          db.rollback(() => {
            return res.status(500).json({ message: "Error posting event" });
          });
        }

        // Insert the organizer as a participant
        const insertParticipantQuery =
          "INSERT INTO Participants (event_id, user_id) VALUES (?, ?)";
        db.query(
          insertParticipantQuery,
          [result.insertId, organizer_id], // Use the ID of the inserted event and organizer
          (err, result) => {
            if (err) {
              console.error("Error adding organizer as participant:", err);
              // Rollback transaction on error
              db.rollback(() => {
                return res.status(500).json({ message: "Error posting event" });
              });
            }

            // Commit transaction if both inserts are successful
            db.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                return res.status(500).json({ message: "Error posting event" });
              }

              console.log("Event posted successfully");
              return res
                .status(201)
                .json({ message: "Event posted successfully" });
            });
          }
        );
      }
    );
  });
});

// get all participants by eventId
app.get("/api/participants/:eventId", (req, res) => {
  // Extract the event ID from the request parameters
  const eventId = req.params.eventId;

  // SQL query to retrieve user IDs of participants for the event
  const sql = "SELECT user_id FROM Participants WHERE event_id = ?";

  // Execute the query
  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching participants:", err);
      return res.status(500).json({ message: "Error fetching participants" });
    }

    // Send the retrieved user IDs as JSON response
    return res.status(200).json(results);
  });
});

// delete event , cancel event
app.put("/api/cancel-event/:eventId", (req, res) => {
  // Extract the event ID from the request parameters
  const eventId = req.params.eventId;

  // Check if the organizer is authenticated and authorized to cancel the event
  // This step depends on your authentication and authorization logic

  // SQL query to update the status of the event to "canceled"
  const sql = "UPDATE Events SET status = 'canceled' WHERE event_id = ?";

  // Execute the query to update the event status
  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("Error canceling event:", err);
      return res.status(500).json({ message: "Error canceling event" });
    }

    // Check if the event was found and updated
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Send a success response
    return res.status(200).json({ message: "Event canceled successfully" });
  });
});

// get all request
// GET all requests from the Requests table
app.get("/api/requests", (req, res) => {
  // Query to fetch all requests with associated usernames
  const getAllRequestsQuery = `
    SELECT Requests.*, Users.username
    FROM Requests
    INNER JOIN Users ON Requests.user_id = Users.user_id AND Requests.status = 'pending'
  `;

  // Execute the query
  db.query(getAllRequestsQuery, (err, results) => {
    if (err) {
      console.error("Error fetching requests:", err);
      return res.status(500).json({ message: "Error fetching requests" });
    }

    // Return the results as JSON response
    res.status(200).json(results);
  });
});

// update request, allow permission
app.put("/api/allow-permissions/:userId", (req, res) => {
  const userId = req.params.userId;

  // Retrieve request data from the request body
  const { requestType } = req.body;

  // Check if the requestType is valid
  if (requestType !== "organizer" && requestType !== "administrator") {
    return res.status(400).json({ message: "Invalid request type" });
  }

  // Begin a database transaction to update both tables atomically
  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    // Update the Requests table
    const updateRequestQuery =
      "UPDATE Requests SET status = 'approved' WHERE user_id = ? AND request_type = ?";
    db.query(updateRequestQuery, [userId, requestType], (err, result) => {
      if (err) {
        db.rollback(function () {
          console.error("Error updating Requests table:", err);
          return res
            .status(500)
            .json({ message: "Error updating Requests table" });
        });
      }

      // Update the Users table
      const updateUserQuery = "UPDATE Users SET role = ? WHERE user_id = ?";
      db.query(updateUserQuery, [requestType, userId], (err, result) => {
        if (err) {
          db.rollback(function () {
            console.error("Error updating Users table:", err);
            return res
              .status(500)
              .json({ message: "Error updating Users table" });
          });
        }

        // Commit the transaction if all updates were successful
        db.commit(function (err) {
          if (err) {
            db.rollback(function () {
              console.error("Error committing transaction:", err);
              return res
                .status(500)
                .json({ message: "Error committing transaction" });
            });
          }

          // Send a success response
          return res
            .status(200)
            .json({ message: "Permissions allowed successfully" });
        });
      });
    });
  });
});

// delete request
// Delete request, reject permission
app.put("/api/reject-permissions/:userId", (req, res) => {
  const userId = req.params.userId;

  // Retrieve request data from the request body
  const { requestType } = req.body;

  // Begin a database transaction to delete the request
  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    // Delete the request from the Requests table
    const deleteRequestQuery =
      "DELETE FROM Requests WHERE user_id = ? AND request_type = ?";
    db.query(deleteRequestQuery, [userId, requestType], (err, result) => {
      if (err) {
        db.rollback(function () {
          console.error("Error deleting request from Requests table:", err);
          return res
            .status(500)
            .json({ message: "Error deleting request from Requests table" });
        });
      }

      // Commit the transaction if deletion was successful
      db.commit(function (err) {
        if (err) {
          db.rollback(function () {
            console.error("Error committing transaction:", err);
            return res
              .status(500)
              .json({ message: "Error committing transaction" });
          });
        }

        // Send a success response
        return res
          .status(200)
          .json({ message: "Request rejected successfully" });
      });
    });
  });
});

// fetch all event request , get event request
app.get("/api/event-requests", (req, res) => {
  // Query the database to retrieve all event requests along with the username and event title
  const query = `
      SELECT er.*, u.username, e.title as event_title
      FROM event_requests er
      INNER JOIN Users u ON er.user_id = u.user_id
      INNER JOIN events e ON er.event_id = e.event_id
      WHERE e.status = 'active' AND er.status = 'pending'
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching event requests:", err);
      return res.status(500).json({ message: "Error fetching event requests" });
    }
    // Send the event requests with usernames and event titles as a JSON response
    res.json(results);
  });
});

// accept event request
app.put("/api/accept-event-request/:request_id", (req, res) => {
  const request_id = req.params.request_id;
  // Begin a database transaction to perform multiple operations atomically
  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }
    // Update the event_requests table to set the status to 'accepted'
    const updateRequestQuery =
      "UPDATE event_requests SET status = 'accepted' WHERE request_id = ?";
    db.query(updateRequestQuery, [request_id], (err, result) => {
      if (err) {
        db.rollback(function () {
          console.error("Error updating event_requests table:", err);
          return res
            .status(500)
            .json({ message: "Error updating event_requests table" });
        });
      }
      // Insert a new record into the participants table
      const insertParticipantQuery =
        "INSERT INTO participants (user_id, event_id) SELECT user_id, event_id FROM event_requests WHERE request_id = ?";
      db.query(insertParticipantQuery, [request_id], (err, result) => {
        if (err) {
          db.rollback(function () {
            console.error("Error inserting into participants table:", err);
            return res
              .status(500)
              .json({ message: "Error inserting into participants table" });
          });
        }
        // Commit the transaction if all operations were successful
        db.commit(function (err) {
          if (err) {
            db.rollback(function () {
              console.error("Error committing transaction:", err);
              return res
                .status(500)
                .json({ message: "Error committing transaction" });
            });
          }
          // Send a success response
          return res
            .status(200)
            .json({ message: "Event request accepted successfully" });
        });
      });
    });
  });
});

// decline event request
app.put("/api/reject-event-request/:request_id", (req, res) => {
  const request_id = req.params.request_id;

  // Begin a database transaction to perform multiple operations atomically
  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    // Update the event_requests table to set the status to 'declined'
    const updateRequestQuery =
      "UPDATE event_requests SET status = 'declined' WHERE request_id = ?";
    db.query(updateRequestQuery, [request_id], (err, result) => {
      if (err) {
        db.rollback(function () {
          console.error("Error updating event_requests table:", err);
          return res
            .status(500)
            .json({ message: "Error updating event_requests table" });
        });
      }

      // Commit the transaction if all operations were successful
      db.commit(function (err) {
        if (err) {
          db.rollback(function () {
            console.error("Error committing transaction:", err);
            return res
              .status(500)
              .json({ message: "Error committing transaction" });
          });
        }

        // Send a success response
        return res
          .status(200)
          .json({ message: "Event request declined successfully" });
      });
    });
  });
});

// //get notification
// app.get("/api/notifications/:user_id", (req, res) => {
//   const { user_id } = req.params;
//   console.info(user_id);
//   const sql = "SELECT * FROM notifications WHERE user_id = ?";
//   db.query(sql, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching notifications:", err);
//       return res.status(500).json({ message: "Error fetching notifications" });
//     }
//     return res.status(200).json(results);
//   });
// });

app.get("/api/notifications/:user_id", (req, res) => {
  const { user_id } = req.params;
  console.info(user_id);
  const sql = "SELECT * FROM Notifications WHERE user_id = ? ORDER BY datetime_created DESC";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Error fetching notifications" });
    }
    return res.status(200).json(results);
  });
});


// send notification
app.post("/api/send-notification/:userId", (req, res) => {
  const userId = req.params.userId;
  const { type, message } = req.body;
  console.info(userId);

  // Validate request body
  if (!type || !message) {
    return res.status(400).json({ message: "Type and message are required" });
  }

  // Insert notification into the database
  const sql = "INSERT INTO Notifications (user_id, type, message, status) VALUES (?, ?, ?, 'unread')";
  db.query(sql, [userId, type, message], (err, result) => {
    if (err) {
      console.error("Error inserting notification:", err);
      return res.status(500).json({ message: "Error inserting notification" });
    }
    
    // Notification inserted successfully
    res.status(200).json({ message: "Notification sent successfully" });
  });
});


// mark read notifications
app.put("/api/notifications/:user_id/markAsRead", (req, res) => {
  const { user_id } = req.params;
  console.info(user_id);
  const sql = "UPDATE Notifications SET status = 'read' WHERE user_id = ?";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error updating notification status:", err);
      return res
        .status(500)
        .json({ message: "Error updating notification status" });
    }
    return res
      .status(200)
      .json({ message: "Notifications marked as read successfully" });
  });
});

// get unread notification from user
app.get("/api/notifications/unreadCount/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `SELECT COUNT(*) AS unreadCount FROM Notifications WHERE user_id = ? AND status = 'unread'`;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("Error fetching unread notification count:", err);
      return res
        .status(500)
        .json({ message: "Error fetching unread notification count" });
    }
    const unreadCount = result[0].unreadCount;
    return res.status(200).json({ unreadCount });
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
