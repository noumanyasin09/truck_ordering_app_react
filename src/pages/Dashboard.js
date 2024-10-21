import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  
  // Function to fetch requests from the backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data); // Assuming response data is an array of requests
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Handle error, maybe redirect to login if unauthorized
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to determine the status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800 p-3';
      case 'in progress':
        return 'bg-blue-200 text-blue-800 p-3';
      case 'completed':
        return 'bg-green-200 text-green-800 p-3';
      case 'canceled':
        return 'bg-red-200 text-red-800 p-3';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-slate-400 text-cyan-100">
          <thead className='bg-slate-800 text-cyan-600'>
            <tr>
              <th>Request ID</th>
              <th>Pickup Location</th>
              <th>Delivery Location</th>
              <th>Size (m³)</th>
              <th>Weight (kg)</th>
              <th>Pickup Time</th>
              <th>Delivery Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.pickup_location}</td>
                <td>{request.delivery_location}</td>
                <td>{request.size}</td>
                <td>{request.weight}</td>
                <td>{new Date(request.pickup_time).toLocaleString()}</td>
                <td>{new Date(request.delivery_time).toLocaleString()}</td>
                <td>
                  <span className={`badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
