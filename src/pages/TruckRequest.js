import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TruckRequest = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Check if the user is logged in by checking for a token
        const token = localStorage.getItem('token');
        
        if (!token) {
          // If no token, redirect to login
          navigate('/login');
        }
      }, [navigate]);

  const [formData, setFormData] = useState({
    pickup_location: '',
    delivery_location: '',
    size: '',
    weight: '',
    pickup_time: '',
    delivery_time: '',
  });
  
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!formData.pickup_location || !formData.delivery_location || !formData.size || !formData.weight || !formData.pickup_time || !formData.delivery_time) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post('http://localhost:8000/api/orders', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect to the dashboard on successful request creation
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to create request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Truck Request</h2>
          {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pickup Location</span>
              </label>
              <input 
                type="text" 
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleInputChange}
                placeholder="Enter pickup location" 
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Delivery Location</span>
              </label>
              <input 
                type="text" 
                name="delivery_location"
                value={formData.delivery_location}
                onChange={handleInputChange}
                placeholder="Enter delivery location" 
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Size (in cubic meters)</span>
              </label>
              <input 
                type="number" 
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="Enter size" 
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Weight (in kg)</span>
              </label>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight" 
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pickup Time</span>
              </label>
              <input 
                type="datetime-local" 
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleInputChange}
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Delivery Time</span>
              </label>
              <input 
                type="datetime-local" 
                name="delivery_time"
                value={formData.delivery_time}
                onChange={handleInputChange}
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TruckRequest;
