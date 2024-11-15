import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();
const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem('userName'); // Retrieve logged-in username
  const navigate = useNavigate()
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${username}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    if (username) fetchMessages();
  }, [username]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Application Status Messages
      </h1>
  
      {/* Messages Section */}
      {messages && messages.length > 0 ? (
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message._id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              <p className="text-lg font-semibold text-blue-700">
                Job: {message.jobName}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(message.date).toLocaleDateString()}
              </p>
              <p
                className={`text-sm font-medium ${
                  message.decision === 'Accepted'
                    ? 'text-green-600'
                    : message.decision === 'Rejected'
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}
              >
                Decision: {message.decision}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">
          No application messages available.
        </p>
      )}
  
      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 border-t">
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

export default MessagePage;
