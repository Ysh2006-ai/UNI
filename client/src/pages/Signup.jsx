import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, isAuthenticated, user } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Client form state
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPassword, setClientPassword] = useState('');

    // Engineer form state
    const [engineerName, setEngineerName] = useState('');
    const [engineerEmail, setEngineerEmail] = useState('');
    const [engineerPassword, setEngineerPassword] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === 'client' ? '/client-dashboard' : '/engineer-dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    const handleClientSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!clientName || !clientEmail || !clientPassword) {
            setError('Please fill all fields for client registration.');
            return;
        }

        if (clientPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await signup({
                name: clientName,
                email: clientEmail,
                password: clientPassword,
                role: 'client'
            });

            if (data.success) {
                navigate('/client-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEngineerSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!engineerName || !engineerEmail || !engineerPassword) {
            setError('Please fill all fields for engineer registration.');
            return;
        }

        if (engineerPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await signup({
                name: engineerName,
                email: engineerEmail,
                password: engineerPassword,
                role: 'engineer'
            });

            if (data.success) {
                navigate('/engineer-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-body">
            <nav>
                <div className="nav-logo">
                    <img src="/logo.png" alt="UNI Logo" height="50px" width="50px" />
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

                    {error && (
                        <div style={{
                            background: 'rgba(255, 77, 79, 0.15)',
                            border: '1px solid rgba(255, 77, 79, 0.3)',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            marginBottom: '20px',
                            color: '#ff6b6b',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            maxWidth: '500px',
                            margin: '0 auto 20px'
                        }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                            {error}
                        </div>
                    )}

                    <div className="intro-boxes">
                        <div className="get-started-box-client">
                            <h4 className="client-box-heading">Get Started as Client</h4>
                            <form id="client-form" onSubmit={handleClientSubmit}>
                                <div className="namec">
                                    <p>Name :</p>
                                    <input
                                        type="text"
                                        id="namec"
                                        placeholder="Full Name"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="emailc">
                                    <p>E-mail :</p>
                                    <input
                                        type="email"
                                        id="emailc"
                                        placeholder="Email Address"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="passwordc">
                                    <p>Password :</p>
                                    <input
                                        type="password"
                                        id="passwordc"
                                        placeholder="Min 6 characters"
                                        value={clientPassword}
                                        onChange={(e) => setClientPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    id="submitc"
                                    value={isLoading ? 'Creating Account...' : 'Get Started'}
                                    disabled={isLoading}
                                />
                            </form>
                        </div>
                        <div className="get-started-box-engineer">
                            <h4 className="engineer-box-heading">Get Started as Engineer</h4>
                            <form id="engineer-form" onSubmit={handleEngineerSubmit}>
                                <div className="namee">
                                    <p>Name :</p>
                                    <input
                                        type="text"
                                        id="namee"
                                        placeholder="Full Name"
                                        value={engineerName}
                                        onChange={(e) => setEngineerName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="emaile">
                                    <p>E-mail :</p>
                                    <input
                                        type="email"
                                        id="emaile"
                                        placeholder="Email Address"
                                        value={engineerEmail}
                                        onChange={(e) => setEngineerEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="passworde">
                                    <p>Password :</p>
                                    <input
                                        type="password"
                                        id="passworde"
                                        placeholder="Min 6 characters"
                                        value={engineerPassword}
                                        onChange={(e) => setEngineerPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    id="submite"
                                    value={isLoading ? 'Creating Account...' : 'Get Started'}
                                    disabled={isLoading}
                                />
                            </form>
                        </div>
                    </div>
                    <div style={{ marginTop: '25px' }}>
                        <p style={{ color: '#ccc', fontSize: '0.95rem' }}>
                            Already have an account? <Link to="/login" style={{ color: '#3498db', fontWeight: 600 }}>Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
