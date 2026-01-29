import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // FontAwesome is already in index.html, no need to inject Bootstrap
    // Using standard CSS classes defined in login.css

    useEffect(() => {
        const storedUsername = localStorage.getItem('rememberedUsername');
        if (storedUsername) {
            setUsername(storedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setShowModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Must enter both Username and Password to continue.');
            return;
        }

        if (!role) {
            setShowModal(true);
            return;
        }

        // Mock Login
        localStorage.setItem('username', username);
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        if (role === 'engineer') {
            navigate('/engineer-dashboard');
        } else {
            navigate('/client-dashboard');
        }
    };

    return (
        <div className="login-page-wrapper">

            {/* Role Selection Modal (Custom Overlay) */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Select Your Role</h5>
                        </div>
                        <div className="modal-body text-center" style={{ textAlign: 'center', padding: '20px' }}>
                            <p style={{ marginBottom: '20px' }}>Please select your portal to continue:</p>
                            <div className="d-flex" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <button onClick={() => handleRoleSelect('client')} className="btn" id="clientBtn" style={{ color: 'white' }}>Client</button>
                                <button onClick={() => handleRoleSelect('engineer')} className="btn" id="engineerBtn" style={{ color: 'white' }}>Engineer</button>
                            </div>
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

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span><i className="fas fa-user"></i></span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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

                        <button type="submit" className="login_btn">
                            LOGIN
                        </button>
                    </form>

                    <div className="card-footer">
                        <div className="links">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                        <a href="#">Forgot your password?</a>
                    </div>
                </div>
            </div>

            {/* Inline CSS for the custom modal overlay since we removed Bootstrap JS/CSS */}
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
