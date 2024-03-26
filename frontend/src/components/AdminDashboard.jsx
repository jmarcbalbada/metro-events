import React, { useContext } from "react";
import {
  Typography,
  Container,
  makeStyles,
  Button,
  Box,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themes/theme";
import UpcomingEvents from "../events/UpcomingEvents";
import RegisteredEvents from "../events/RegisteredEvents";
import AllowPermissions from "./AllowPermissions";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import axios from "axios";

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
    justifyContent: "center",
    marginTop: theme.spacing(4),
    gap: theme.spacing(4),
  },
}));

const AdminDashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  if (!user) {
    navigate("/");
    return null; // Return null to prevent rendering anything else
  }

  const handlePostEvent = () => {
    navigate("/post-event");
  };

  // const sendNotification = async () => {
  //   const userId = 12; // User ID to send the notification to
  //   const type = "randomType"; // Random notification type
  //   const message = "This is a test notification"; // Random message
  //   console.log(userId, type, message);

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8081/api/send-notification/${userId}`,
  //       {
  //         type,
  //         message,
  //       }
  //     );
  //     if (response && response.data) {
  //       console.log("Notification sent successfully:", response.data);
  //     } else {
  //       console.error("Error sending notification: Response data is undefined");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error sending notification:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container className={classes.container}>
          <Typography variant="h4" gutterBottom>
            Welcome to Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            style={{ textAlign: "left", lineHeight: "1.6" }}
          >
            <strong>Metro Events</strong> is your ultimate platform for seamless
            event organization and participant management. As an administrator,
            you wield the power to oversee and enhance the event experience for
            all users.
            <br />
            <br />
            <strong>Key Features:</strong>
            <br />
            <br />
            <em>Effortless Event Creation:</em> Users can create and customize
            events effortlessly, from intimate gatherings to large-scale
            extravaganzas.
            <br />
            <br />
            <em>Streamlined Participant Management:</em> Administrators have the
            authority to review, accept, or decline user requests to join
            events, ensuring a vibrant and engaged community.
            <br />
            <br />
            <em>Timely Notifications:</em> Stay informed with real-time
            notifications, keeping you updated on event requests, participant
            status, and important announcements.
            <br />
            <br />
            <em>Event Oversight:</em> Admins can override and delete upcoming
            events as needed, ensuring the platform's integrity and user
            experience.
            <br />
            <br />
            Experience the Power of Metro Events: Join us in shaping
            unforgettable moments and fostering meaningful connections, one
            event at a time.
          </Typography>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handlePostEvent}
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
          {/* <Button onClick={sendNotification}>Send Notif</Button> */}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default AdminDashboard;
