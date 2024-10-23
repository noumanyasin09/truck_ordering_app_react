import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({}); // State to hold error messages
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // This reads from .env
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });

      if (response.data.status === 200) {
        const token = response.data.data.token;
        const name = response.data.data.name;

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("login_time", Date.now());
        const sessionExpiryTime = Date.now() + 3600000; // 1 hour from now
        localStorage.setItem("session_expiry", sessionExpiryTime);

        setError({}); // Clear any previous errors
        navigate("/dashboard"); // Redirect to dashboard after successful login
      } else {
        setError({ general: response.data.message });
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        if (err.response.data.errors && err.response.data.errors.general) {
          setError({ general: err.response.data.errors.general });
        } else {
          // Handling Laravel validation errors (similar to registration)
          const apiErrors = err.response.data.errors;

          const formattedErrors = Object.keys(apiErrors).reduce((acc, key) => {
            acc[key] = apiErrors[key][0]; // Get the first message for each field
            return acc;
          }, {});

          setError(formattedErrors);
        }
      } else if (err.response) {
        // Generic error message if no validation errors
        setError({
          general:
            err.response.data.message || "An error occurred. Please try again.",
        });
      } else if (err.request) {
        // No response received after the request was made
        setError({
          general: "No response from the server. Please try again later.",
        });
      } else {
        // Any other errors
        setError({ general: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">
            Access your account to request trucks and monitor your shipments.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
                {error.email && (
                  <span style={{ color: "red" }}>{error.email}</span>
                )}
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
                {error.password && (
                  <span style={{ color: "red" }}>{error.password}</span>
                )}
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
              {/* General error message (e.g., incorrect credentials) */}
              {error.general && (
                <div style={{ color: "red" }}>{error.general}</div>
              )}
            </form>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
