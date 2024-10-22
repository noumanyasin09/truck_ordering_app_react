import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TruckRequest from './pages/TruckRequest';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  useEffect(() => {
    const checkSessionTimeout = () => {
      const sessionExpiry = localStorage.getItem('session_expiry');
      const currentTime = Date.now();
      
      if (sessionExpiry && currentTime > sessionExpiry) {
        handleSessionExpiry();
      }
    };

    // Check session timeout every minute
    const intervalId = setInterval(checkSessionTimeout, 60000);

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSessionExpiry = () => {
    // Clear localStorage or any other storage holding user session
    localStorage.removeItem('token');
    localStorage.removeItem('login_time');
    localStorage.removeItem('session_expiry');

    // Optionally, show a message to the user
    alert('Your session has expired. Please log in again.');

    // Redirect to login page
    window.location.href = '/login'; // Adjust this to your login page route
  };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/truck-request" element={<TruckRequest />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
