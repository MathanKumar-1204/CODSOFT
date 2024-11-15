import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const username = localStorage.getItem('userName'); 
  const navigate = useNavigate();
  const [newJob, setNewJob] = useState({
    jobName: '',
    companyName: '',
    place: '',
    jobType: '',
    salary: '',
    studyRequirements: '',
    name: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Fetch jobs from the backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newJob)
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const savedJob = await response.json();
      setJobs((prevJobs) => [...prevJobs, savedJob]);  // Update job list
      setShowForm(false);  // Close the form
      setNewJob({  // Reset form fields
        jobName: '',
        companyName: '',
        place: '',
        jobType: '',
        salary: '',
        studyRequirements: '',
        name: '',
        contactEmail: '',
        contactPhone: ''
      });
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold py-6">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700">Welcome, {username}!</h1>
            <p className="text-lg text-gray-600">Discover the latest job opportunities tailored for you.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Post Job
          </button>
        </div>

        {/* Job Post Form */}
        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post a New Job</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { name: 'jobName', placeholder: 'Job Title' },
                  { name: 'companyName', placeholder: 'Company Name' },
                  { name: 'place', placeholder: 'Location' },
                  { name: 'jobType', placeholder: 'Job Type' },
                  { name: 'salary', placeholder: 'Salary' },
                  { name: 'studyRequirements', placeholder: 'Study Requirements' },
                  { name: 'name', placeholder: 'Poster Name' },
                  { name: 'contactEmail', placeholder: 'Contact Email', type: 'email' },
                  { name: 'contactPhone', placeholder: 'Contact Phone' }
                ].map((field, index) => (
                  <input
                    key={index}
                    type={field.type || 'text'}
                    name={field.name}
                    value={newJob[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required
                    className="border border-gray-300 rounded-lg p-3 text-sm"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Job Cards */}
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {jobs.map((job) => (
            <Link to={`/job/${job._id}`} key={job._id}>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:bg-blue-50 transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.jobName}</h3>
                <p className="text-gray-600"><strong>Company:</strong> {job.companyName}</p>
                <p className="text-gray-600"><strong>Location:</strong> {job.place}</p>
                <p className="text-gray-600"><strong>Job Type:</strong> {job.jobType}</p>
                <p className="text-gray-600"><strong>Salary:</strong> {job.salary}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-3 border-t">
          {[
            { label: 'Home', route: '/home', icon: '🏠' },
            { label: 'Search', route: '/search', icon: '🔍' },
            { label: 'Notifications', route: '/notifications', icon: '🔔' },
            { label: 'Messages', route: '/messages', icon: '💬' },
            { label: 'Profile', route: '/profile', icon: '👤' },
            { label: 'Logout', route: '/', icon: '🚪' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="text-gray-600 hover:text-indigo-600 flex items-center"
            >
              {item.icon} <span className="ml-2">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
