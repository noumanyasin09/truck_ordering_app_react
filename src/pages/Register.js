import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,  // This reads from .env
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    c_password: '',
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
  
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    }
  
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
  
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    if (formData.password !== formData.c_password) {
      errors.c_password = 'Passwords do not match';
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await api.post('auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        c_password: formData.c_password
      });

      // Save token to local storage
      localStorage.setItem('token', response.data.data.token);

      // Clear the form fields
      setFormData({
        name: '',
        email: '',
        password: '',
        c_password: '',
      });
      setSuccessMessage('Registration successful! You are now logged in.');
      setError('');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Set the errors from Laravel's response
        const apiErrors = error.response.data.errors;
        
        // Convert Laravel error object to a more readable format
        const formattedErrors = Object.keys(apiErrors).reduce((acc, key) => {
          acc[key] = apiErrors[key][0];  // Assuming each error array has one message
          return acc;
        }, {});
        
        setError(formattedErrors);  // Set the formatted errors in the state
      } else {
        setError({ general: 'Network error, please try again.' });
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register</h1>
          <p className="py-6">Create your account to start using the truck ordering service.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
          <div>
  {error && Object.keys(error).map((field) => (
    <div key={field} style={{ color: 'red' }}>
      {error[field]}  {/* Display error message for each field */}
    </div>
  ))}
</div>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="c_password"
                  value={formData.c_password}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
            <p className="mt-4 text-center">
              Already have an account? <Link to="/login" className="text-primary">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
