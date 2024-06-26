import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@material-ui/core";

const EventRequests = () => {
  const [requests, setRequests] = useState([]);
  //console.log(requests);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/event-requests"
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching event requests:", error);
      }
    };

    fetchRequests();

    // const intervalId = setInterval(fetchRequests, 5000); // Fetch every 5 seconds

    // // Clean up the interval on component unmount
    // return () => clearInterval(intervalId);
  }, [requests]);

  const handleAccept = async (request, requestId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/accept-event-request/${requestId}`
      );
      // Log the response or handle it as needed
      console.log(response.data); // Assuming the response contains relevant information
      const type = "Event Request Status";
      const message = `Your request for event "${request.event_title}" has been approved, see you there!`;
      await sendNotification(request.user_id, type, message);
    } catch (error) {
      console.error("Error accepting event request:", error);
      // Handle error if needed
    }
  };

  const handleReject = async (request, requestId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/reject-event-request/${requestId}`
      );
      // Log the response or handle it as needed
      console.log(response.data); // Assuming the response contains relevant information
      const type = "Event Request Status";
      const message = `Your request for event "${request.event_title}" has been denied, you may try joining other events!`;
      await sendNotification(request.user_id, type, message);
    } catch (error) {
      console.error("Error declining event request:", error);
      // Handle error if needed
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

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Event Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography>No event requests found.</Typography>
      ) : (
        <List>
          {requests.map((request, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <ListItemText
                primary={
                  <>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Event Name: {request.event_title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Username: {request.username}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Status: {request.status}
                    </Typography>
                  </>
                }
              />
              <div style={{ marginTop: "10px" }}>
                <Button
                  color="primary"
                  onClick={() => handleAccept(request, request.request_id)}
                >
                  ✔ Accept
                </Button>
                <Button
                  color="secondary"
                  onClick={() => handleReject(request, request.request_id)}
                >
                  ✖ Reject
                </Button>
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default EventRequests;
