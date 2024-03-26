import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { Snackbar } from "@material-ui/core";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import MuiAlert from "@material-ui/lab/Alert";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
import Box from "@mui/material/Box";
import AlignItemsList from "../data/AlignItemsList";
import AlertDialogModal from "../components/AlertDialogModal";
import Button from "@mui/joy/Button";
import { styled } from "@mui/material/styles";
import ExampleTextareaComment from "../components/ExampleTextareaComment";
import { UserContext } from "../hooks/UserContext"; // Import UserContext
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getRandomImageUrl } from "../data/imagesUtils";
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Container = styled(Box)({
  marginTop: "50px", // Adjust the margin as needed
  maxWidth: "1100px", // Adjust the max width as needed
  marginLeft: "auto",
  marginRight: "auto",
});

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [expanded, setExpanded] = React.useState(false);
  const [comment, setComment] = useState("");
  const { user } = useContext(UserContext); // Get user context
  const [favorite, setFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitSnackbarOpen, setSubmitSnackbarOpen] = useState(false);
  const [countVote, setCountVote] = useState(0);
  const randomImageUrl = getRandomImageUrl();
  const navigate = useNavigate();
  // participate = -1 declined , 0 - pending, 1 - accepted / joined, 2 - join this event
  const [participate, setParticipate] = useState("");
  const isFromRegister = new URLSearchParams(location.search).get(
    "fromRegister"
  );

  console.log("is register? ", isFromRegister);
  // console.log(countVote);
  // console.log(user);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/events/${eventId}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkUpvoteStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/is-upvoting/${user.user_id}/${eventId}`
        );
        const isUpvoting = response.data.isUpvoting;
        setFavorite(isUpvoting);
        // console.log("Is upvoting:", isUpvoting);
        // Handle the upvote status as needed
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    const countTotalVote = async () => {
      console.log(eventId);
      try {
        const response = await axios.get(
          "http://localhost:8081/api/upvotes/count",
          {
            params: {
              event_id: eventId,
            },
          }
        );
        const totalUpvotes = response.data.totalUpvotes;
        setCountVote(totalUpvotes);
        console.log("Total upvotes:", totalUpvotes);
        // You can set the total upvotes state or perform other actions as needed
      } catch (error) {
        console.error("Error fetching total upvotes:", error);
        // Handle error
      }
    };

    const getUserStatusParticipation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/event-request-status/${eventId}/${user.user_id}`
        );
        setParticipate(response.data.status);
        console.log("participate", participate);
      } catch (error) {
        console.error("Error fetching user status participation:", error);
        throw error;
      }
    };

    fetchEventDetails();
    if (user) {
      checkUpvoteStatus();
    }

    countTotalVote();
    getUserStatusParticipation();
  }, [eventId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleJoinEvent = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/event-requests",
        {
          event_id: eventId,
          user_id: user.user_id,
        }
      );
      setParticipate("pending");
      setSubmitSnackbarOpen(true);
      console.log(response.data);
      // Close the dialog
    } catch (error) {
      console.error("Error posting event request:", error);
      // Handle error
    } finally {
    }
  };

  const handleUpvote = async () => {
    console.log("favorite", favorite);
    try {
      const userLocalId = localStorage.getItem("userId");
      console.log(eventId, user.user_id);

      if (favorite) {
        // If already favorited, remove the upvote
        await axios.post("http://localhost:8081/api/remove-upvotes", {
          event_id: eventId,
          user_id: user.user_id,
        });

        // Decrement the countVote state after removing upvote
        setCountVote((prevCount) => prevCount - 1);
      } else {
        // If not favorited, add the upvote
        await axios.post("http://localhost:8081/api/upvotes", {
          event_id: eventId,
          user_id: user.user_id,
        });

        // Increment the countVote state after upvoting
        setCountVote((prevCount) => prevCount + 1);
      }

      // Toggle the favorite state after successful upvote operation
      setFavorite(!favorite);

      // Optionally, you can update the event data to reflect the upvote
      // For example, you could increment a upvote count or change the UI
    } catch (error) {
      console.error("Error handling upvote:", error);
    }
  };

  const cancelEventAdminOrganizer = async (reason) => {
    let isSuccess = false;
    try {
      await axios.put(`http://localhost:8081/api/cancel-event/${eventId}`);
      isSuccess = true;
      await sendCancellationNotifications(reason);
      console.log("issucces", isSuccess);
      console.log(reason);
    } catch (error) {
      console.error("Error canceling event:", error);
    }
    if (isSuccess) {
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  };

  const sendNotification = async (userId, type, message) => {
    console.log(userId, type, message);
    try {
      const response = await axios.post(
        `http://localhost:8081/api/send-notification/${userId}`,
        {
          type,
          message,
        }
      );
      if (response && response.data) {
        console.log("Notification sent successfully:", response.data);
      } else {
        console.error("Error sending notification: Response data is undefined");
      }
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const sendCancellationNotifications = async (reason) => {
    try {
      // Fetch all participants for the event
      const response = await axios.get(
        `http://localhost:8081/api/participants/${event.event_id}`
      );
      const participants = response.data;

      // Iterate over each participant and send cancellation notification
      participants.forEach(async (participant) => {
        const userId = participant.user_id;
        const type = "Event Cancellation";
        const message = `The event "${event.title}" scheduled for ${new Date(
          event?.date
        ).toLocaleDateString()} at ${
          event.location
        } has been canceled. Reason: ${reason}`;
        await sendNotification(userId, type, message);
      });

      console.log("Cancellation notifications sent successfully.");
    } catch (error) {
      console.error("Error sending cancellation notifications:", error);
    }
  };

  // submitSnackbarOpen
  const handleCloseSubmitSnackbar = () => {
    setSubmitSnackbarOpen(false);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBackEvent = () => {
    navigate(-1);
    console.log("Back");
  };

  return (
    <Container>
      {loading ? (
        // Render loading indicator if loading is true
        <Typography>Loading...</Typography>
      ) : event ? (
        // Render card if event data is available
        <>
          <IconButton aria-label="go back page" onClick={handleBackEvent}>
            <Box sx={{ marginRight: "14px" }}>
              <ArrowBackIcon />
            </Box>
            Back
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h3"
              sx={{ display: "inline", marginRight: "10px" }}
            >
              Event Details
            </Typography>
            {participate === "accepted" && (
              <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                <Button
                  color="success"
                  variant="outlined"
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "auto",
                  }}
                >
                  ✔ Joined
                </Button>
              </Typography>
            )}

            {user.role === "administrator" && (
              <Typography variant="h5" sx={{ marginLeft: "55%" }}>
                <AlertDialogModal
                  text="Cancel this event"
                  onCancel={cancelEventAdminOrganizer}
                />
              </Typography>
            )}

            {participate === "pending" && (
              <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                <Button
                  color="warning"
                  variant="outlined"
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "auto",
                  }}
                >
                  Pending
                </Button>
              </Typography>
            )}

            {participate === "declined" && (
              <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                <Button
                  color="danger"
                  variant="outlined"
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "auto",
                  }}
                >
                  ✖ declined
                </Button>
              </Typography>
            )}

            {participate === "unknown" &&
              event.organizer_id !== user.user_id &&
              user.role !== "administrator" && (
                <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                  <Button
                    color="primary"
                    variant="soft"
                    sx={{
                      "&:hover": { backgroundColor: "transparent" },
                      cursor: "pointer",
                    }}
                    onClick={handleJoinEvent}
                  >
                    Join this event
                  </Button>
                </Typography>
              )}

            {participate === "unknown" &&
              event.organizer_id === user.user_id && (
                <Typography variant="h5" sx={{ marginLeft: "34%" }}>
                  <AlertDialogModal
                    text="Cancel this event"
                    onCancel={cancelEventAdminOrganizer}
                  />
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      "&:hover": { backgroundColor: "transparent" },
                      cursor: "auto",
                      marginLeft: "20px",
                    }}
                  >
                    ✔ You organized this event
                  </Button>
                </Typography>
              )}

            {/* {isFromRegister === "true" ? (
              <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                <Button
                  color="success"
                  variant="outlined"
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "auto",
                  }}
                >
                  ✔ Joined
                </Button>
              </Typography>
            ) : (
              <Typography variant="h5" sx={{ marginLeft: "60%" }}>
                <Button color="primary" variant="soft">
                  Join this event
                </Button>
              </Typography>
            )} */}
          </Box>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {event.event_id}
                </Avatar>
              }
              title={event.title}
              subheader={new Date(event?.date).toLocaleDateString()}
            />
            <CardMedia
              component="img"
              height="194"
              image={randomImageUrl}
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {event?.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites" onClick={handleUpvote}>
                {favorite ? (
                  <FavoriteIcon sx={{ color: red[500] }} />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {favorite
                  ? `You and ${countVote} other people loved this event`
                  : `${countVote} people loved this event`}
              </Typography>

              <IconButton aria-label="share"></IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <AlignItemsList eventId={event.event_id} />
                <Box mt={2}>
                  {" "}
                  {/* Add margin top to create space between list and textarea */}
                  <ExampleTextareaComment
                    eventId={event.event_id}
                    user_id={user.user_id}
                  />
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </>
      ) : (
        // Render message if event data is null
        <Typography>No event found</Typography>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
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

      <Snackbar
        open={submitSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSubmitSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSubmitSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          Request has been submitted and to be reviewed by the organizer or
          admin!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

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
