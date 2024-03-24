import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { UserProvider } from "./hooks/UserContext";
import PostEvent from "./events/PostEvent";
import EventDetails from "./events/EventDetails";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-event" element={<PostEvent />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
