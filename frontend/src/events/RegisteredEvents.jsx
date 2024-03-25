import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link
import { UserContext } from "../hooks/UserContext";
import { Typography, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventIcon from "@mui/icons-material/Event";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AlertDialogModal from "../components/AlertDialogModal";

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { user } = useContext(UserContext);
  const fromRegister = true;
  // console.log(user);
  // console.log(registeredEvents);

  useEffect(() => {
    <CheckCircleIcon style={{ color: "green", marginLeft: "5px" }} />;
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/registered-events/${user.user_id}`
        );
        setRegisteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      }
    };

    if (user) {
      fetchRegisteredEvents();
    }
  }, [registeredEvents]);

  const handleCancelEvent = async (eventId) => {
    const success = false;
    try {
      // Make a request to the server to cancel the event
      await axios.put(`http://localhost:8081/api/cancel-event/${eventId}`);

      // If the request is successful, remove the canceled event from the state
      setRegisteredEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventId)
      );

      // Show the snackbar
      setShowSnackbar(true);
      success = true;

      // Log a message indicating the event cancellation
      console.log("Event canceled successfully:", eventId);
    } catch (error) {
      console.error("Error canceling event:", error);
    }
    console.log("Cancel event with ID:", eventId);

    if (success) {
    }
  };

  const sampleReason = (reason) => {
    console.log(reason);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary",
        borderRadius: 4,
        p: 2,
      }}
    >
      <h2
        style={{
          width: "fit-content",
          marginBottom: "10px",
          marginRight: registeredEvents.length === 0 ? "130px" : "0px",
        }}
      >
        {user.role === "user" ? "Registered Events" : "Your Events"}
      </h2>
      {registeredEvents.length === 0 ? (
        <Typography>No registered events yet</Typography>
      ) : (
        <List sx={{ width: "100%" }}>
          {registeredEvents.map((event) => (
            <div key={event.event_id} style={{ display: "flex" }}>
              {/* Event Details */}
              <div style={{ flex: "1" }}>
                <Link
                  to={`/event/${event.event_id}?fromRegister=true`}
                  style={{ textDecoration: "none" }}
                >
                  <ListItem sx={{ py: 1 }}>
                    <ListItemAvatar style={{ cursor: "auto" }}>
                      <Avatar>{getIcon(event.type)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography>{event.title}</Typography>
                          <CheckCircleIcon
                            style={{ color: "green", marginLeft: "5px" }}
                          />
                          {/* Add other event details here */}
                        </div>
                      }
                      secondary={
                        <Typography component="div">
                          {new Date(event.date).toLocaleDateString()} <b>|</b>{" "}
                          {event.location}
                          <br />
                          {event.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Link>
              </div>
              {(user.role === "organizer" || user.role === "administrator") && (
                <div style={{ flex: "1", marginLeft: "10px" }}>
                  <AlertDialogModal
                    onCancel={() => handleCancelEvent(event.event_id)}
                  />
                </div>
              )}
            </div>
          ))}
        </List>
      )}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Event canceled successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

const getIcon = (type) => {
  switch (type) {
    case "Photos":
      return <ImageIcon />;
    case "Work":
      return <WorkIcon />;
    case "Vacation":
      return <BeachAccessIcon />;
    case "Bike":
      return <DirectionsBikeIcon />;
    case "Musical":
      return <MusicNoteIcon />;
    case "Food":
      return <FastfoodIcon />;
    default:
      return <EventIcon />;
  }
};

export default RegisteredEvents;
