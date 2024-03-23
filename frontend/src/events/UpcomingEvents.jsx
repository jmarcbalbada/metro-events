import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../hooks/UserContext"; // Import UserContext
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@material-ui/core";
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

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { user } = useContext(UserContext);
  console.log(user);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/upcoming-events"
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleItemClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/event-requests",
        {
          event_id: selectedEvent.event_id,
          user_id: user.user_id,
        }
      );
      console.log(response.data);
      // Close the dialog
      setDialogOpen(false);
    } catch (error) {
      console.error("Error posting event request:", error);
      // Handle error
    } finally {
      setDialogOpen(false);
    }
  };

  const handleCancelEvent = async (eventId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/cancel-event/${eventId}`
      );
      console.log(response.data);
      // Show snackbar on successful cancellation
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error canceling event:", error);
      // Handle error
    }
  };

  const handleCancel = () => {
    // Close the dialog without taking any action
    setDialogOpen(false);
  };

  // Check if the user's role is suitable for clicking events
  const isUserRoleClickable = () => {
    // Define an array of roles that are allowed to click events
    const clickableRoles = ["user"];
    // Check if the user's role is included in the clickable roles array
    return clickableRoles.includes(user.role);
  };

  const isAdmin = user.role === "administrator";

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
      <h2 style={{ width: "fit-content", marginBottom: "10px" }}>
        Upcoming Events
      </h2>
      {events.length === 0 ? (
        <Typography>No upcoming events yet</Typography>
      ) : (
        <List sx={{ width: "100%" }}>
          {events.map((event) => (
            <ListItem
              key={event.event_id}
              onClick={
                isUserRoleClickable() ? () => handleItemClick(event) : null
              }
              sx={{
                py: 1,
                cursor: isUserRoleClickable() ? "pointer" : "default",
              }}
            >
              <ListItemAvatar>
                <Avatar>{getIcon(event.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {event.title}
                    {isAdmin && (
                      <Typography
                        variant="body2"
                        component="span"
                        style={{
                          color: "#f44336",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCancelEvent(event.event_id)}
                      >
                        ✖ Cancel
                      </Typography>
                    )}
                  </>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Participation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to participate in this event?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Event canceled successfully!
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

export default UpcomingEvents;
