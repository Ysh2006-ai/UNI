import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>About UniEngineer</h3>
                        <ul>
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">How It Works</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>For Clients</h3>
                        <ul>
                            <li><a href="#">Post a Project</a></li>
                            <li><a href="#">Find Engineers</a></li>
                            <li><a href="#">Success Stories</a></li>
                            <li><a href="#">Client Resources</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>For Engineers</h3>
                        <ul>
                            <li><a href="#">Join as an Engineer</a></li>
                            <li><a href="#">Available Projects</a></li>
                            <li><a href="#">Engineer Resources</a></li>
                            <li><a href="#">Community</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Connect With Us</h3>
                        <p>Stay updated with our latest news and insights.</p>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
