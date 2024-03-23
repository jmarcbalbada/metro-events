import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../hocs/AppBar";
import {
  Typography,
  Container,
  makeStyles,
  TextField,
  Button,
  MenuItem,
  Select,
  Snackbar,
} from "@material-ui/core";
import { UserContext } from "../hooks/UserContext";
import axios from "axios";
import { EventTypes } from "./typesEvents";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    margin: theme.spacing(1),
    width: "80%",
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const PostEvent = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8081/api/post-event",
        {
          organizer_id: user.user_id,
          title,
          description,
          type,
          date,
          location,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Show the alert after a delay of 1500 milliseconds
      setTimeout(() => {
        setShowAlert(true);
        // Navigate to dashboard after showing the alert
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // Adjust the delay time as needed
      }, 1000);
    } catch (error) {
      console.error("Error posting event:", error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <>
      <NavBar user={user} />
      <Container className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Post New Event
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Select
            className={classes.textField}
            label="Type"
            variant="outlined"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Type</em>
            </MenuItem>
            {Object.values(EventTypes).map((eventType) => (
              <MenuItem key={eventType} value={eventType}>
                {eventType}
              </MenuItem>
            ))}
          </Select>
          <TextField
            className={classes.textField}
            label=""
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Post Event
          </Button>
        </form>
      </Container>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message="Event posted successfully"
      />
    </>
  );
};

export default PostEvent;
