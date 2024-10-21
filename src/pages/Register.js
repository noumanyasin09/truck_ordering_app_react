import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    const { name, email, password, c_password } = formData;
    setError('');

    // Check if fields are empty
    if (!name || !email || !password || !c_password) {
      return 'All fields are required.';
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.';
    }

    // Validate password length and match
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (password !== c_password) {
      return 'Passwords do not match.';
    }

    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
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
      // Handle error response
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred during registration.');
      } else {
        setError('Network error, please try again.');
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
            {error && <div className="alert alert-error">{error}</div>} {/* Error Message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Success Message */}
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
