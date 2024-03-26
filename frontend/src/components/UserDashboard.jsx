import React, { useState, useContext } from "react";
import { Typography, Container, makeStyles, Button } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../themes/theme"; // Import your theme
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UpcomingEvents from "../events/UpcomingEvents";
import { UserContext } from "../hooks/UserContext"; // Import UserContext
import RegisteredEvents from "../events/RegisteredEvents";
import { getRandomImageUrl } from "../data/imagesUtils";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    textAlign: "center",
    display: "flex", // Make the container a flex container
    justifyContent: "center", // Center the items horizontally
    alignItems: "flex-start", // Align items to the start vertically
    flexWrap: "wrap", // Allow items to wrap to the next line if needed
  },
  button: {
    marginTop: theme.spacing(2),
  },
  eventsContainer: {
    width: "100%", // Set the width of the container to 100%
    display: "flex", // Make the container a flex container
    justifyContent: "center", // Center the items horizontally
    alignItems: "flex-start", // Align items to the start vertically
    flexWrap: "wrap", // Allow items to wrap to the next line if needed
  },
  eventComponent: {
    width: "30%", // Set the width of each event component
    margin: theme.spacing(1), // Add margin between the components
  },
}));

const UserDashboard = () => {
  const classes = useStyles();
  const [requestStatus, setRequestStatus] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false); // State for Snackbar
  const [pendingRequestSnackbar, setPendingRequestSnackbar] = useState(false);
  const { user } = useContext(UserContext); // Access user context
  const randomImageUrl = getRandomImageUrl();
  console.log("db", user);

  const handleRequestOrganizer = async () => {
    try {
      // Get the user ID from local storage or wherever it's stored
      const userId = localStorage.getItem("userId");

      // Make a POST request to the /api/request-organizer endpoint
      const response = await axios.post(
        "http://localhost:8081/api/request-organizer",
        {
          userId: userId,
        }
      );

      // Update the request status based on the response
      if (response.status === 200) {
        setRequestStatus("pending_approval");
        setShowSnackbar(true); // Show Snackbar when request is successful
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        setPendingRequestSnackbar(true);
        if (error.response.status === 400) {
          setRequestStatus("already_pending");
        } else {
          setRequestStatus("error");
        }
      } else {
        setRequestStatus("error");
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Container className={classes.container}>
          <Typography variant="h2" gutterBottom>
            Welcome to Metro Events!
          </Typography>
          <img
            src={randomImageUrl}
            alt="Metro Events"
            style={{ width: "55%", marginBottom: "20px" }}
          />
          <Typography variant="body1">
            Welcome to Metro Events, where every adventure awaits! 🌟 From
            heart-pounding Trail Biking to competitive Basketball Games and
            groovy Zumba Sessions, we've got it all – even epic University
            gatherings and meaningful Run-for-a-Cause events. But here's the
            best part: it's not just about attending. Engage with fellow
            participants, share your enthusiasm with upvotes, and leave your
            mark with reviews. Join us and make every moment count – let's
            create unforgettable memories together! 🎉
          </Typography>
          {requestStatus === "already_pending" && (
            <Typography color="error" variant="body2">
              There is already a pending request for this user.
            </Typography>
          )}
          {requestStatus === "pending_approval" && (
            <Typography color="accent" variant="body2">
              Your request has been submitted and is pending for approval.
            </Typography>
          )}
          {requestStatus !== "already_pending" &&
            requestStatus !== "pending_approval" && (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleRequestOrganizer}
              >
                Request to become an organizer
              </Button>
            )}
        </Container>
        <div className={classes.eventsContainer}>
          <div className={classes.eventComponent}>
            <UpcomingEvents />
          </div>
          <div className={classes.eventComponent}>
            <RegisteredEvents />
          </div>
        </div>
      </ThemeProvider>
      {showSnackbar && (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert onClose={() => setShowSnackbar(false)} severity="success">
            Your request to become an organizer has been submitted and is
            pending for approval.
          </Alert>
        </Snackbar>
      )}
      {pendingRequestSnackbar && (
        <Snackbar
          open={pendingRequestSnackbar}
          autoHideDuration={6000}
          onClose={() => setPendingRequestSnackbar(false)}
        >
          <Alert
            onClose={() => setPendingRequestSnackbar(false)}
            severity="warning"
          >
            You already have a pending request. It is being reviewed by an
            administrator.
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default UserDashboard;
