import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import customTheme from "../themes/theme";
import axios from "axios";
import "../styles/appbar.css";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  // Add your custom styles here
  backgroundColor: theme.palette.primary.main, // Change this to the desired color
}));

export default function PrimarySearchAppBar({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showPendingAlert, setShowPendingAlert] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log(user);
  }, []);

  const handleBecomeAdmin = async () => {
    try {
      // Make a POST request to the API endpoint to request administrator role
      const response = await axios.post(
        "http://localhost:8081/api/request-administrator",
        {
          userId: userId, // Assuming user object contains user_id
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        setShowAlert(true);
      }

      // Log success message
      console.log(
        "Request to become an administrator sent successfully:",
        response.data.message
      );

      // You can also display a success message to the user if needed
    } catch (error) {
      // Check if the error is due to a pending request
      if (error.response && error.response.status === 400) {
        setShowPendingAlert(true); // Set state to show pending request alert
      } else {
        // Log other errors
        console.error("Error requesting administrator role:", error);
        // You can also display an error message to the user if needed
      }
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      {/* Add MenuItem for "Become Admin" */}
      {user && (user.role === "user" || user.role === "organizer") && (
        <MenuItem onClick={handleBecomeAdmin}>Become Admin</MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* Use the custom styled AppBar component */}
        <StyledAppBar theme={customTheme} position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Hello, {user && user.username ? user.username : "Guest"}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {user && (user.role === "user" || user.role === "organizer") && (
                <MenuItem onClick={handleBecomeAdmin}>Become Admin</MenuItem>
              )}
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </StyledAppBar>
        {renderMobileMenu}
        {renderMenu}
        {showAlert && (
          <Snackbar open={showAlert} onClose={() => setShowAlert(false)}>
            <Alert severity="success">
              Your request has been sent. It will be reviewed by an
              administrator.
            </Alert>
          </Snackbar>
        )}
        {showPendingAlert && (
          <Snackbar
            open={showPendingAlert}
            autoHideDuration={6000}
            onClose={() => setShowPendingAlert(false)}
          >
            <Alert
              onClose={() => setShowPendingAlert(false)}
              severity="warning"
            >
              You already have a pending request. It is being reviewed by an
              administrator.
            </Alert>
          </Snackbar>
        )}
      </Box>
    </>
  );
}
