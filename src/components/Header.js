import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link to="/">Truck Ordering App</Link>
                </h1>

                {/* Hamburger menu for mobile */}
                <button
                    className="md:hidden text-white"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                        />
                    </svg>
                </button>

                {/* Links */}
                <nav
                    className={`${
                        isOpen ? 'block' : 'hidden'
                    } md:flex space-x-4 md:space-x-8`}
                >
                    <Link className="block py-2 text-white" to="/">Home</Link>
                    {token ? (
                        <>
                            <Link className="block py-2 text-white" to="/dashboard">Dashboard</Link>
                            <Link className="block py-2 text-white" to="/truck-request">Request Truck</Link>
                            <button
                                className="block py-2 text-white"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="block py-2 text-white" to="/login">Login</Link>
                            <Link className="block py-2 text-white" to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
