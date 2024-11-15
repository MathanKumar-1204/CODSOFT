import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [applicantProfile, setApplicantProfile] = useState(null); // To store the applicant's profile data
  const username = localStorage.getItem('userName'); // Retrieve logged-in username
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/${username}`);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    if (username) fetchNotifications();
  }, [username]);

  const handleDecision = async (notificationId, decision) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/notifications/${notificationId}/decision`, { decision });
      alert(response.data.message);

      // Update the local notifications state to reflect the decision
      setNotifications((prevNotifications) =>
        prevNotifications.map(n =>
          n._id === notificationId ? { ...n, decision } : n
        )
      );
    } catch (error) {
      console.error("Error processing decision:", error);
    }
  };

  const fetchApplicantProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile?email=${email}`);
      setApplicantProfile(response.data);
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
      setApplicantProfile(null);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
  
      {/* Notifications Section */}
      {notifications && notifications.length > 0 ? (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              <p className="text-lg font-semibold text-blue-700">
                {notification.jobName}
              </p>
              <p className="text-sm text-gray-600">
                Applied for: {notification.jobName}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(notification.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                Contact: {notification.applicantEmail}
              </p>
  
              {/* View Applicant Profile Button */}
              <button
                onClick={() => fetchApplicantProfile(notification.applicantEmail)}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                View Applicant Profile
              </button>
  
              {/* Decision Buttons */}
              {!notification.decision ? (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleDecision(notification._id, 'accepted')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(notification._id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Decision: {notification.decision}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">No notifications available.</p>
      )}
  
      {/* Applicant Profile Popup */}
      {applicantProfile && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {applicantProfile.name}
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>Email: {applicantProfile.email}</p>
              <p>Bio: {applicantProfile.bio}</p>
              <p>Degree: {applicantProfile.degree}</p>
              <p>Position: {applicantProfile.position}</p>
              <p>Work Experience: {applicantProfile.workExperience} years</p>
              <p>Address: {applicantProfile.address}</p>
              <p>
                Job Preferences: {applicantProfile.jobPreference.join(', ')}
              </p>
            </div>
            <button
              onClick={() => setApplicantProfile(null)}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-3 border-t">
        {[
          { label: 'Home', route: '/home', icon: '🏠' },
          { label: 'Search', route: '/search', icon: '🔍' },
          { label: 'Notifications', route: '/notifications', icon: '🔔' },
          { label: 'Messages', route: '/messages', icon: '💬' },
          { label: 'Profile', route: '/profile', icon: '👤' },
          { label: 'Logout', route: '/', icon: '🚪' },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
  
};

export default NotificationPage;
