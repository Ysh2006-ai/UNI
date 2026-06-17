import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const [role, setRole] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === 'client' ? '/client-dashboard' : '/engineer-dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (!role) {
            setShowModal(true);
            return;
        }

        setIsLoading(true);

        try {
            const data = await login(email, password);

            if (data.success) {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Check if the user's role matches selected role
                if (data.user.role !== role) {
                    setError(`This account is registered as a ${data.user.role}. Please select the correct portal.`);
                    setIsLoading(false);
                    return;
                }

                navigate(role === 'engineer' ? '/engineer-dashboard' : '/client-dashboard');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">

            {/* Role Selection Modal */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="modal-content" style={{ background: 'rgba(30, 30, 30, 0.95)', color: 'white', padding: '30px', maxWidth: '420px' }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px', marginBottom: '20px' }}>
                            <h5 className="modal-title" style={{ color: '#007acc', fontWeight: 700, fontSize: '1.3rem' }}>Select Your Role</h5>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <p style={{ marginBottom: '20px', color: '#ccc' }}>Please select your portal to continue:</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <button onClick={() => handleRoleSelect('client')} className="btn" id="clientBtn" style={{ color: 'white', background: '#007acc', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 600 }}>Client</button>
                                <button onClick={() => handleRoleSelect('engineer')} className="btn" id="engineerBtn" style={{ color: 'white', background: '#00a86b', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 600 }}>Engineer</button>
                            </div>
                            <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#999' }}>
                                Demo: client@demo.com / password123
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className={`main-container ${showModal ? 'blur' : ''}`}>
                <div className="card">
                    <div className="card-header">
                        <h3>{role === 'client' ? 'Client Portal' : role === 'engineer' ? 'Engineer Portal' : 'Sign In'}</h3>
                        <div className="social_icon">
                            <span><i className="fab fa-facebook-square"></i></span>
                            <span><i className="fab fa-google"></i></span>
                            <span><i className="fab fa-twitter-square"></i></span>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255, 77, 79, 0.15)',
                            border: '1px solid rgba(255, 77, 79, 0.3)',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            marginBottom: '15px',
                            color: '#ff6b6b',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span><i className="fas fa-envelope"></i></span>
                            </div>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span><i className="fas fa-lock"></i></span>
                            </div>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <label className="remember">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember Me
                        </label>

                        <button type="submit" className="login_btn" disabled={isLoading}>
                            {isLoading ? (
                                <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Logging in...</>
                            ) : (
                                'LOGIN'
                            )}
                        </button>
                    </form>

                    <div className="card-footer">
                        <div className="links">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }} style={{ color: '#007acc', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Switch Role <i className="fas fa-exchange-alt" style={{ marginLeft: '5px' }}></i>
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }
                .blur {
                    filter: blur(5px);
                }
            `}</style>
        </div>
    );
};

export default Login;
