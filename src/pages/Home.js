import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const token = localStorage.getItem('token');

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">Welcome to Truck Ordering Service</h1>
          <p className="py-6">
            Need to move goods quickly and safely? Use our truck ordering service to request a truck and track your
            shipment in real-time. Simple, fast, and reliable!
          </p>
          <div className="flex justify-center space-x-4">
          {!token && (
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
             )}
            <Link to="/truck-request">
              <button className="btn btn-secondary">Request a Truck</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
