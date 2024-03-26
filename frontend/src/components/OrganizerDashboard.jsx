import React, { useContext } from "react";
import {
  Typography,
  Container,
  makeStyles,
  Button,
  Box, // Import Box component from Material-UI
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themes/theme";
import UpcomingEvents from "../events/UpcomingEvents";
import RegisteredEvents from "../events/RegisteredEvents";
import EventRequests from "../events/EventRequests";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/UserContext"; // Import UserContext

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  eventsContainer: {
    display: "flex",
    justifyContent: "center", // Align items horizontally to center
    marginTop: theme.spacing(4),
    gap: theme.spacing(4), // Add gap between the components
    marginLeft: theme.spacing(6),
  },
}));

const OrganizerDashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user context

  // Define handlePostEvent function to navigate to the "PostEvent" page
  const handlePostEvent = () => {
    navigate("/post-event");
  };

  // Redirect to login page if user context is null
  if (!user) {
    navigate("/");
    return null; // Return null to prevent rendering anything else
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container className={classes.container}>
          <Typography variant="h4" gutterBottom>
            Welcome to Organizer Dashboard
          </Typography>
          <Typography
            variant="body1"
            style={{ textAlign: "left", lineHeight: "1.6" }}
          >
            <strong>Metro Events</strong> is your ultimate platform for seamless
            event organization and participant management. As an organizer, you
            hold the reins to curate unforgettable experiences and connect with
            like-minded individuals.
            <br />
            <br />
            <strong>Key Features:</strong>
            <br />
            <br />
            <em>Effortless Event Creation:</em> Create and customize events
            effortlessly, from intimate gatherings to large-scale extravaganzas.
            <br />
            <br />
            <em>Streamlined Participant Management:</em> Review and accept user
            requests to join your events, ensuring a vibrant and engaged
            community.
            <br />
            <br />
            <em>Timely Notifications:</em> Stay informed with real-time
            notifications, keeping you updated on event requests, participant
            status, and important announcements.
            <br />
            <br />
            Experience the Power of Metro Events: Join us in shaping
            unforgettable moments and fostering meaningful connections, one
            event at a time.
          </Typography>

          {/* Button to redirect to the PostEvent page */}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handlePostEvent} // Call handlePostEvent function on button click
          >
            Post New Event
          </Button>
        </Container>
        <Box className={classes.eventsContainer}>
          {/* Display UpcomingEvents and RegisteredEvents components inline */}
          <UpcomingEvents />
          <RegisteredEvents />
        </Box>
        <Box className={classes.eventsContainer}>
          <EventRequests />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OrganizerDashboard;
