import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
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
import { styled } from "@mui/material/styles";
import ExampleTextareaComment from "../components/ExampleTextareaComment";
import { UserContext } from "../hooks/UserContext"; // Import UserContext
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [countVote, setCountVote] = useState(0);
  const navigate = useNavigate();
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

    fetchEventDetails();
    if (user) {
      checkUpvoteStatus();
    }

    countTotalVote();
  }, [eventId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
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
          <Typography variant="h3" gutterBottom>
            Event Details
          </Typography>
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
              image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
    default:
      return <EventIcon />;
  }
};
