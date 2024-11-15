import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
const Search = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(null); // Initially no display
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch all jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (query) => {
    // Filter jobs by jobName based on search query
    const filtered = jobs.filter((job) =>
      job.jobName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-6">
      {/* Header Section */}
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">Search Jobs</h1>
      <SearchBar onSearch={handleSearch} />
  
      {/* Loading Spinner or Results */}
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-8">
          {filteredJobs && filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Link to={`/job/${job._id}`} key={job._id}>
                <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.jobName}</h3>
                  <p className="text-gray-600 mb-1">
                    <strong>Company:</strong> {job.companyName}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Location:</strong> {job.place}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Job Type:</strong> {job.jobType}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Salary:</strong> {job.salary}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No jobs found matching your search.</p>
          )}
        </div>
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
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
  
};

export default Search;
