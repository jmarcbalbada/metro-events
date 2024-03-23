import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  makeStyles,
  Link,
  CircularProgress,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../themes/theme";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../hooks/UserContext";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    position: "relative", // Set position to relative
  },
}));

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when login request is sent
    setErrorMessage(""); // Clear previous error message
    setSuccessMessage(""); // Clear previous success message

    // Simulate a delay of 1 second before making the login request
    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:8081/login", {
          username,
          password,
        });

        // Update user state globally
        setUser(response.data.user);

        console.log(response.data.message); // Log success message
        console.log(response.data.user.username);
        // Store username
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("userId", response.data.user.user_id);
        setSuccessMessage("Login successful"); // Set success message
        navigate("/dashboard");
        // Optionally, you can redirect the user to another page upon successful login
        // history.push('/dashboard');
      } catch (error) {
        console.error("Login error:", error.response.data.message);
        setErrorMessage(error.response.data.message); // Set error message in state
      }
      setLoading(false); // Set loading state to false when response is received
    }, 1000); // Delay of 1 second
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <div className={classes.formContainer}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading} // Disable the button when loading
            >
              {loading && (
                <CircularProgress
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -12,
                    marginLeft: -12,
                  }}
                />
              )}
              Sign In
            </Button>
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography variant="body2" style={{ color: "green" }}>
                {successMessage}
              </Typography>
            )}
            <Typography>
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register">
                Sign up here
              </Link>
            </Typography>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
