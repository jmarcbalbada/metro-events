import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Rating from "@mui/material/Rating"; // Import Rating from Joy UI
import axios from "axios"; // Import axios library

export default function AlignItemsList({ eventId }) {
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/reviews/${eventId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [reviews]);

  return (
    <Box sx={{ width: 1060 }}>
      <Typography
        id="ellipsis-list-demo"
        level="body-xs"
        textTransform="uppercase"
        sx={{ letterSpacing: "0.15rem" }}
      >
        <b>Reviews</b>
      </Typography>
      <List
        aria-labelledby="ellipsis-list-demo"
        sx={{ "--ListItemDecorator-size": "56px" }}
      >
        {reviews.map((review) => (
          <ListItem key={review.review_id}>
            <ListItemDecorator>
              <Avatar alt={review.username.toUpperCase()} />
            </ListItemDecorator>
            <ListItemContent>
              <Typography level="title-sm">{review.comment}</Typography>
              <Typography level="body-sm" noWrap>
                by {review.username}
              </Typography>
            </ListItemContent>
            <Rating
              name={`rating-${review.review_id}`}
              value={review.rating}
              precision={0.5}
              readOnly
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
