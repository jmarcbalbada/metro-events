import React, { useState, useEffect, useContext } from "react";
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

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { user } = useContext(UserContext);
  console.log(user);
  console.log(registeredEvents);

  useEffect(() => {
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
  }, []);

  const handleCancelEvent = async (eventId) => {
    try {
      // Make a request to the server to cancel the event
      await axios.put(`http://localhost:8081/api/cancel-event/${eventId}`);

      // If the request is successful, remove the canceled event from the state
      setRegisteredEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventId)
      );

      // Show the snackbar
      setShowSnackbar(true);

      // Log a message indicating the event cancellation
      console.log("Event canceled successfully:", eventId);
    } catch (error) {
      console.error("Error canceling event:", error);
    }
    console.log("Cancel event with ID:", eventId);
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
      <h2 style={{ width: "fit-content", marginBottom: "10px", marginRight: registeredEvents.length === 0 ? "130px" : "0px" }}>
        {user.role === "user" ? "Registered Events" : "Your Events"}
      </h2>
      {registeredEvents.length === 0 ? (
        <Typography>No registered events yet</Typography>
      ) : (
        <List sx={{ width: "100%" }}>
          {registeredEvents.map((event) => (
            <ListItem key={event.event_id} sx={{ py: 1 }}>
              <ListItemAvatar>
                <Avatar>{getIcon(event.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography>{event.title}</Typography>
                    <CheckCircleIcon
                      style={{ color: "green", marginLeft: "5px" }}
                    />
                    {user && 
                    ((user.role === "organizer" && user.user_id === event.organizer_id) || user.role === "administrator") && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          style={{
                            color: "#f44336",
                            cursor: "pointer",
                            marginLeft: "10px",
                          }}
                          onClick={() => handleCancelEvent(event.event_id)}
                        >
                          Cancel
                        </Typography>
                      </div>
                    )}
                  </div>
                }
                secondary={
                  <Typography component="div">
                    Date: {new Date(event.date).toLocaleDateString()} <b>|</b>{" "}
                    Location: {event.location}
                    <br />
                    Description: {event.description}
                  </Typography>
                }
              />
            </ListItem>
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
