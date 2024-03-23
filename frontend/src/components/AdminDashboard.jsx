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
import AllowPermissions from "./AllowPermissions";
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
  },
}));

const AdminDashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user context

  if (!user) {
    navigate("/");
    return null; // Return null to prevent rendering anything else
  }

  const handlePostEvent = () => {
    navigate("/post-event");
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container className={classes.container}>
          <Typography variant="h4" gutterBottom>
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="body1">
            This is your personalized dashboard. You can view your profile,
            check your notifications, and manage your account settings here.
          </Typography>
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
          <UpcomingEvents />
          <RegisteredEvents />
        </Box>
        <Box className={classes.eventsContainer}>
          <AllowPermissions />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default AdminDashboard;
