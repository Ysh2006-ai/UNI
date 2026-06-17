import React, { useState } from 'react';
import { submitContactAPI } from '../api/messages';
import '../styles/contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const data = await submitContactAPI(formData);
            setStatus('success');
            setStatusMessage(data.message || 'Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus('error');
            setStatusMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <div className="contact-page-container">
            <div className="background-animation">
                <div style={{ top: '10%', left: '20%' }}></div>
                <div style={{ top: '40%', left: '60%' }}></div>
                <div style={{ top: '70%', left: '30%' }}></div>
                <div style={{ top: '20%', left: '80%' }}></div>
                <div style={{ top: '50%', left: '10%' }}></div>
            </div>

            <div className="container contact-container">
                <div className="profile-pic">
                    <img src="/logo.png" alt="UNI" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=UNI&background=007acc&color=fff&size=150'; }} />
                </div>
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Whether you have questions about our platform, need support, or want to collaborate — reach out to us.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Your Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                            required
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Message</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="How can we help you?"
                            required
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #007acc, #005fa3)',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: status === 'sending' ? 'wait' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 15px rgba(0, 122, 204, 0.4)'
                        }}
                    >
                        {status === 'sending' ? (
                            <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Sending...</>
                        ) : (
                            <><i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Send Message</>
                        )}
                    </button>
                </form>

                {statusMessage && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        background: status === 'success' ? 'rgba(0, 168, 107, 0.2)' : 'rgba(255, 77, 79, 0.2)',
                        color: status === 'success' ? '#00e676' : '#ff6b6b',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        <i className={`fas ${status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
                        {statusMessage}
                    </div>
                )}

                <div className="contact-details" style={{ marginTop: '25px' }}>
                    <p><strong>Email:</strong> yashyadav0663@gmail.com</p>
                    <p><strong>Location:</strong> Noida, India</p>
                </div>

                <footer style={{ marginTop: '20px' }}>copyright &#169; 2026</footer>
            </div>
        </div>
    );
};

export default Contact;
