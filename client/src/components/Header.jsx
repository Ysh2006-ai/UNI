import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <header>
            <div className="container">
                <nav>
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="UniEngineer Logo" />
                    </Link>
                    <ul className="nav-links">
                        <li><a href="/#about">About</a></li>
                        <li><a href="/#features">Features</a></li>
                        <li><a href="/#how-it-works">How It Works</a></li>
                        <li><a href="/#benefits">Benefits</a></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/login" className="btn login-btn">Login <i className="fas fa-sign-in-alt"></i></Link></li>
                    </ul>
                    <button
                        id="dark-mode-toggle"
                        className="dark-mode-toggle"
                        aria-label="Toggle Dark Mode"
                        onClick={toggleDarkMode}
                    >
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
