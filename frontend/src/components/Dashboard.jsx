import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { UserContext } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom"; 
import NavBar from "../hocs/AppBar";
import UserDashboard from "./UserDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import AdminDashboard from "./AdminDashboard";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const [role, setRole] = useState("user");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Redirect to login page if user context is null
    if (!user) {
      navigate("/"); // Redirect to the login page
    } else {
      // Retrieve user role from user object if available
      setRole(user.role);
    }
  }, [user, navigate]); // Include navigate in the dependency array

  // Render loading state if user is not yet available
  if (!user) {
    return <div>Loading...</div>;
  }

  // Render dashboard components based on user role
  return (
    <>
      <NavBar user={user} />
      {role === "user" ? (
        <UserDashboard user={user} />
      ) : role === "administrator" ? (
        <AdminDashboard />
      ) : (
        <OrganizerDashboard />
      )}
    </>
  );
};

export default Dashboard;
