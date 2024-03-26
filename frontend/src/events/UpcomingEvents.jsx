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
import { Link } from "react-router-dom";
import "../styles/alertmodal.css";
import AlertDialogModal from "../components/AlertDialogModal";
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { user } = useContext(UserContext);

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

  const handleCancelEvent = async (eventId) => {
    try {
      await axios.put(`http://localhost:8081/api/cancel-event/${eventId}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error canceling event:", error);
    }
  };

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
              component={Link} // Add component prop to make the entire ListItem act as a Link
              to={`/event/${event.event_id}?fromRegister=false`}
              sx={{
                py: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                textDecoration: "none", // Add this to remove default text decoration
              }}
            >
              <ListItemAvatar>
                <Avatar>{getIcon(event.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography style={{ paddingRight: "15px" }}>
                      {event.title}
                    </Typography>
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
              {/* {user.role === "administrator" && (
                <AlertDialogModal
                  // onCancel={() => handleCancelEvent(event.event_id)}
                  onClick={console.log("clicked")}
                  sx={{ zIndex: 9999 }}
                />
              )} */}
            </ListItem>
          ))}
        </List>
      )}
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
    case "Concert":
      return <CampaignIcon />;
    case "Conference":
      return <PeopleOutlineIcon />;
    case "Seminar":
      return <ConnectWithoutContactIcon />;
    case "Exhibition":
      return <SportsGymnasticsIcon />;
    default:
      return <EventIcon />;
  }
};

export default UpcomingEvents;
