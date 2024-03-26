import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import HoverRating from "../data/HoverRating"; // Import the HoverRating component
import axios from "axios";

export default function ExampleTextareaComment({ eventId, user_id }) {
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [textareaValue, setTextareaValue] = React.useState("Type something here…");
  const [ratingValue, setRatingValue] = React.useState(null); // State for the rating value

  const handleSendButtonClick = async () => {
    console.log("Textarea value:", textareaValue);
    console.log("Rating value:", ratingValue);

    try {
      const userLocalId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:8081/api/post-review`,
        {
          event_id: eventId,
          user_id: user_id ? user_id : userLocalId,
          rating: ratingValue !== null ? ratingValue : 1,
          comment: textareaValue,
        }
      );
      console.log("Review posted successfully:", response.data);

      // Optionally, handle the response as needed
    } catch (error) {
      console.error("Error posting review:", error);
      // Optionally, handle the error
    }

    setTextareaValue("");
    console.log(textareaValue);
  };

  return (
    <FormControl>
      <FormLabel>Your comment</FormLabel>
      <Textarea
        placeholder={textareaValue}
        minRows={3}
        onChange={(e) => setTextareaValue(e.target.value)}
        endDecorator={
          <Box
            sx={{
              display: "flex",
              gap: "var(--Textarea-paddingBlock)",
              pt: "var(--Textarea-paddingBlock)",
              borderTop: "1px solid",
              borderColor: "divider",
              flex: "auto",
            }}
          >
            <HoverRating
              value={ratingValue} // Pass the rating value as the value prop
              onRatingChange={(value) => setRatingValue(value)} // Update ratingValue when rating changes
            />{" "}
            <Button onClick={handleSendButtonClick} sx={{ ml: "auto" }}>
              Send
            </Button>
          </Box>
        }
        sx={{
          minWidth: 300,
          fontWeight,
          fontStyle: italic ? "italic" : "initial",
        }}
      />
    </FormControl>
  );
}
