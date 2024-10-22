import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // State to hold error message
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/auth/login', {
      email,
      password
    })
    .then((response) => {
        if(response.data.status === 200){
            console.log(response.data.data.token);
            const token = response.data.data.token; // Assuming the token comes in this format
            const name = response.data.data.name; 

            localStorage.setItem('token', token);
            localStorage.setItem('name', name); 
            localStorage.setItem('login_time', Date.now());
            // Set session expiry time to 1 hour
            const sessionExpiryTime = Date.now() + 3600000; // 1 hour from now
            localStorage.setItem('session_expiry', sessionExpiryTime);

            setError(null);  // Clear any previous errors
            navigate('/dashboard');  // Redirect to dashboard after successful login
        }else {
            setError(response.data.message)
        }

    })
    .catch((err) => {
      // Capture the error and set the error message for the user to see
      if (err.response) {
        // If we get a response from the server with a 4xx or 5xx status code
        setError(err.response.data.message || 'An error occurred. Please try again.');  
      } else if (err.request) {
        // If no response was received after the request was made
        setError('No response from the server. Please try again later.');
      } else {
        // Any other errors
        setError('An unexpected error occurred.');
      }
    });
  };

  return (
    
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">Access your account to request trucks and monitor your shipments.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            {/* Error Message */}
        {error && <div className="alert alert-error shadow-lg mb-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172l5.656 5.656M14.828 9.172l-5.656 5.656" />
              </svg>
              <span>{error}</span>
            </div>
          </div>}
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
              />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
              />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
            <p className="mt-4 text-center">
              Don't have an account? <Link to="/register" className="text-primary">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
