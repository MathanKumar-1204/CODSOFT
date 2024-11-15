import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [jobPreference, setJobPreference] = useState(['']); // initialize as an array to hold multiple job preferences
  const [jobCount, setJobCount] = useState(1);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await fetch(`http://localhost:5000/user/profile?email=${userEmail}`);
        const data = await response.json();
        setUser(data);
        setBio(data.bio || '');
        setJobPreference(data.jobPreference || ['']);
        setJobCount(data.jobCount || 1);
        setIsProfileComplete(data.bio && data.jobPreference && data.jobCount);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    const userEmail = localStorage.getItem('userEmail');
    formData.append('email', userEmail);
    formData.append('bio', bio);
    formData.append('jobPreference', JSON.stringify(jobPreference)); // store job preferences as JSON string
    formData.append('jobCount', jobCount);

    try {
      const response = await fetch('http://localhost:5000/user/update-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully');
        setIsProfileComplete(true);
      } else {
        alert('Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleJobCountChange = (e) => {
    const count = Math.max(0, parseInt(e.target.value, 10) || 0); // Ensure count is at least 0
    setJobCount(count);
    setJobPreference(count > 0 ? Array(count).fill('') : []); // Set empty array if count is 0
  };

  const handleJobPreferenceChange = (index, value) => {
    const updatedPreferences = [...jobPreference];
    updatedPreferences[index] = value;
    setJobPreference(updatedPreferences);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-8">
      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">My Profile</h2>
  
        <div className="space-y-6">
          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Write a short bio about yourself"
            ></textarea>
          </div>
  
          {/* Number of Job Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Job Types
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={jobCount}
              onChange={handleJobCountChange}
              className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          {/* Job Preferences */}
          {jobCount > 0 &&
            Array.from({ length: jobCount }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">
                  Job Preference {index + 1}
                </label>
                <select
                  value={jobPreference[index] || ''}
                  onChange={(e) => handleJobPreferenceChange(index, e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Job Type</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>
            ))}
  
          {/* Save Profile Button */}
          <button
            onClick={handleProfileUpdate}
            className="w-full mt-6 px-6 py-3 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
  
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
  
}

export default Profile;
