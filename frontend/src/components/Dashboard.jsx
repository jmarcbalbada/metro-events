import React, { useEffect, useState } from "react";
import { Typography, Container, makeStyles } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themes/theme";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState(null);

  // Example: Fetch user data from the server
  useEffect(() => {
    // Make an API request to fetch user data
    // Update the userData state with the fetched data
    // Example:
    // fetchUserData().then((data) => setUserData(data));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Dashboard
        </Typography>
        <Typography variant="body1">
          This is your personalized dashboard. You can display user-specific
          content or functionality here.
        </Typography>
        {/* Example: Render user-specific data */}
        {userData && (
          <div>
            <Typography variant="h6">User Information:</Typography>
            <Typography variant="body1">
              Username: {userData.username}
            </Typography>
            <Typography variant="body1">Email: {userData.email}</Typography>
            {/* Render other user-specific data as needed */}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
