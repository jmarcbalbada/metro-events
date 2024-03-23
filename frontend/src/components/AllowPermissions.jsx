import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themes/theme"; // Import your custom theme
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  listItem: {
    marginBottom: theme.spacing(2), // Add some margin between list items
  },
}));

const AllowPermissions = () => {
  const [requests, setRequests] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [requests]);

  const handleApproveRequest = async (userId, requestType) => {
    try {
      await axios.put(`http://localhost:8081/api/allow-permissions/${userId}`, {
        requestType: requestType,
      });
      // Show success alert
      setAlertOpen(true);
    } catch (error) {
      console.error("Error approving request:", error);
      // Handle error if needed
    }
  };

  const handleRejectRequest = async (userId, requestType) => {
    try {
      await axios.put(
        `http://localhost:8081/api/reject-permissions/${userId}`,
        {
          requestType: requestType,
        }
      );
      // Show success alert
      setAlertOpen(true);
    } catch (error) {
      console.error("Error rejecting request:", error);
      // Handle error if needed
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h5" gutterBottom>
          Requests for Permissions
        </Typography>
        {requests.length === 0 ? (
          <Typography>No requests found.</Typography>
        ) : (
          <List>
            {requests.map((request, index) => (
              <ListItem key={index} className={classes.listItem}>
                <ListItemText
                  primary={`User ID: ${request.user_id}, Username: ${request.username}, Request Type: ${request.request_type}`}
                />
                <Button
                  color="primary"
                  onClick={() =>
                    handleApproveRequest(request.user_id, request.request_type)
                  }
                >
                  ✔ Approve
                </Button>
                <Button
                  color="secondary"
                  onClick={() =>
                    handleRejectRequest(request.user_id, request.request_type)
                  }
                >
                  ✖ Reject
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="success"
        >
          Request processed successfully!
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AllowPermissions;
