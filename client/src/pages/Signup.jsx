import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup.css';

const Signup = () => {
    const navigate = useNavigate();

    const handleClientCurrentSubmit = (e) => {
        e.preventDefault();
        // Mock signup
        localStorage.setItem('role', 'client');
        navigate('/client-dashboard');
    }

    const handleEngineerSubmit = (e) => {
        e.preventDefault();
        // Mock signup
        localStorage.setItem('role', 'engineer');
        navigate('/engineer-dashboard');
    }

    return (
        <div className="signup-body"> {/* Assuming signup.css applies styles to body or we need a wrapper */}
            <nav>
                <div className="nav-logo">
                    <img src="/logo.png" alt="" height="50px" width="50px" />
                </div>
                <div className="nav-opt">
                    <ul>
                        <li><Link className="home" to="/">HOME</Link></li>
                        <li><a className="about" href="/#about">ABOUT</a></li>
                        <li><a className="features" href="/#features">FEATURES</a></li>
                        <li><a className="howitworks" href="/#how-it-works">HOW IT WORKS</a></li>
                        <li><a className="benifits" href="/#benefits">BENEFITS</a></li>
                        <li><Link className="contact" to="/contact">CONTACT</Link></li>
                    </ul>
                </div>
                <div className="burger">
                    <i className="fas fa-bars"></i>
                </div>
            </nav>
            <div className="introduction">
                <div className="intro-heading">
                    <h1 className="heading"><span>U</span>nified <span>E</span>ngineering <span>P</span>latform</h1>
                    <div className="sub-head">
                        <h3>Connecting engineers, streamlining projects, and building the future together.</h3>
                    </div>
                    <div className="intro-boxes">
                        <div className="get-started-box-client">
                            <h4 className="client-box-heading">Get Started as Client</h4>
                            <form id="client-form" onSubmit={handleClientCurrentSubmit}>
                                <div className="namec">
                                    <p>Name :</p>
                                    <input type="text" id="namec" placeholder="Name" /><br />
                                </div>
                                <div className="emailc">
                                    <p>E-mail :</p>
                                    <input type="email" id="emailc" placeholder="Email" /><br />
                                </div>
                                <input type="submit" id="submitc" value="Get Started" />
                            </form>
                        </div>
                        <div className="get-started-box-engineer">
                            <h4 className="engineer-box-heading">Get Started as Engineer</h4>
                            <form id="engineer-form" onSubmit={handleEngineerSubmit}>
                                <div className="namee">
                                    <p>Name :</p>
                                    <input type="text" id="namee" placeholder="Name" /><br />
                                </div>
                                <div className="emaile">
                                    <p>E-mail :</p>
                                    <input type="email" id="emaile" placeholder="Email" /><br />
                                </div>
                                <input type="submit" id="submite" value="Get Started" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
