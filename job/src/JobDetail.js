import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();
const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const navigate = useNavigate();

  // Fetch the job details when the component loads
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Handle form submission for applying to the job
  const handleApply = async (e) => {
    e.preventDefault();
  
    const application = {
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
    };
  
    try {
      // Make the POST request to save the application
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
  
      if (response.ok) {
        setApplicationStatus('Successfully applied!');
      } else {
        setApplicationStatus('Failed to apply. Please try again.');
      }
    } catch (error) {
      setApplicationStatus('Error submitting application. Please try again.');
      console.error("Error applying for the job:", error);
    }
  };
  

  if (loading) {
    return <div className="text-center text-lg font-semibold py-6">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center text-lg font-semibold py-6">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        {/* Job Details */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{job.jobName}</h2>
        <div className="space-y-4">
          <p className="text-gray-700"><strong>Company:</strong> {job.companyName}</p>
          <p className="text-gray-700"><strong>Location:</strong> {job.place}</p>
          <p className="text-gray-700"><strong>Job Type:</strong> {job.jobType}</p>
          <p className="text-gray-700"><strong>Salary:</strong> {job.salary}</p>
          <p className="text-gray-700"><strong>Requirements:</strong> {job.studyRequirements}</p>
        </div>
  
        {/* Job Poster Details */}
        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Poster Details</h3>
          <p className="text-gray-700"><strong>Name:</strong> {job.jobPoster.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {job.jobPoster.contactEmail}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {job.jobPoster.contactPhone}</p>
        </div>
  
        {/* Apply Now Form */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply Now</h2>
          <form onSubmit={handleApply} className="space-y-6">
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg p-3 w-full text-sm"
            />
            <input
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg p-3 w-full text-sm"
            />
            <input
              type="text"
              value={applicantPhone}
              onChange={(e) => setApplicantPhone(e.target.value)}
              placeholder="Your Phone Number"
              required
              className="border border-gray-300 rounded-lg p-3 w-full text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Submit Application
            </button>
          </form>
  
          {/* Display Application Status */}
          {applicationStatus && (
            <div
              className={`mt-6 text-lg font-semibold ${
                applicationStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {applicationStatus}
            </div>
          )}
        </div>
      </div>
  
      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 border-t">
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

export default JobDetail;
