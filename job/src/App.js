// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Profile from "./Profile";
import Home from "./Home";
import JobDetail from './JobDetail';
import Notifications from "./Notification";
import Search from "./Search";
import MessagePage from './MessagePage';
// import Employer from "./Employer";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
           <Route path="/signup" element={<SignUp />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />  
          <Route path="/" element={<Login />} />
         <Route path="/logout" element={<Login />} /> 
         <Route path="/messages" element={<MessagePage />} /> 
         <Route path="/job/:jobId" element={<JobDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
