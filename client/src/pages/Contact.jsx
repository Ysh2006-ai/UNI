import React from 'react';
import '../styles/contact.css'; // We will create this

const Contact = () => {
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
                    <img src="/logo.png" alt="UNI" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150' }} />
                </div>
                <h1>Yash Yadav</h1>
                <p>Hello! we are the developes behind this platform. We created this site to bring together engineers from various disciplines to collaborate and innovate. Our passion for technology and engineering drives us to build solutions that make a difference.</p>

                <div className="contact-details">
                    <p><strong>Email:</strong> yashyadav0663@gmail.com</p>
                    <p><strong>Location:</strong> Noida, India</p>
                </div>

                <footer>copyright &#169; 2026</footer>
            </div>
        </div>
    );
};

export default Contact;
