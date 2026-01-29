import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            const handleScroll = () => {
                if (window.scrollY > 300) {
                    backToTopButton.style.display = 'flex';
                } else {
                    backToTopButton.style.display = 'none';
                }
            };

            const handleClick = () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            };

            window.addEventListener('scroll', handleScroll);
            backToTopButton.addEventListener('click', handleClick);

            return () => {
                window.removeEventListener('scroll', handleScroll);
                backToTopButton.removeEventListener('click', handleClick);
            };
        }
    }, []);
    return (
        <div className="home-container">
            <div className="hero-uni">
                <h1><span>U</span>nified <span>E</span>ngineering <span>P</span>latform</h1>
                <div className="but">
                    <button className="btn btn-primary" aria-label="Get Started and join UniEngineer"><Link to="/signup">Get Started for free <i className="fas fa-arrow-right"></i> </Link>
                    </button>
                </div>
            </div>

            <section id="about" className="fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>About UniEngineer</h2>
                        <p>We are a revolutionary platform that brings together engineers from various disciplines for collaborative project execution.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <i className="fas fa-users"></i>
                            <h3>Connection</h3>
                            <p>Connects engineers across disciplines for comprehensive solutions.</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-comments"></i>
                            <h3>Collaboration</h3>
                            <p>Facilitates seamless communication and teamwork among engineers.</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-project-diagram"></i>
                            <h3>Project Management</h3>
                            <p>Provides tools for efficient tracking of progress and deadlines.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="bg-light fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>Platform Features</h2>
                        <p>A centralized hub for communication, collaboration, and project management.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <i className="fas fa-comment-alt"></i>
                            <h3>Centralized Communication</h3>
                            <p>All engineers collaborate within a single, unified platform.</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-robot"></i>
                            <h3>AI Matching</h3>
                            <p>Automatically suggests the best engineers for each project.</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-sync-alt"></i>
                            <h3>Real-time Collaboration</h3>
                            <p>Work together through shared project files and communication tools.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>A simple process that connects clients with the right engineers for their projects.</p>
                    </div>
                    <div className="accordion">
                        <div className="accordion-item">
                            <div className="accordion-header" role="button" aria-expanded="false" tabIndex="0">
                                <h3>Client: Posts project requirements</h3>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="accordion-content" aria-hidden="true">
                                <p>Clients can easily post their project requirements on the platform.</p>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <div className="accordion-header" role="button" aria-expanded="false" tabIndex="0">
                                <h3>Platform: Matches clients with engineers</h3>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="accordion-content" aria-hidden="true">
                                <p>The platform uses AI to match clients with the best-fit engineers.</p>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <div className="accordion-header" role="button" aria-expanded="false" tabIndex="0">
                                <h3>Engineers: Collaborate on the project</h3>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="accordion-content" aria-hidden="true">
                                <p>Engineers from various disciplines collaborate seamlessly on the project.</p>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <div className="accordion-header" role="button" aria-expanded="false" tabIndex="0">
                                <h3>Client: Tracks project progress</h3>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="accordion-content" aria-hidden="true">
                                <p>Clients can track the progress of their projects in real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="benefits" className="bg-light fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>Benefits</h2>
                        <p>Advantages for both clients and engineers using our platform.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <h3>Clients</h3>
                            <ul>
                                <li>Quick access to the best-fit engineers.</li>
                                <li>Streamlined project management.</li>
                                <li>Transparent communication and progress tracking.</li>
                            </ul>
                        </div>
                        <div className="feature">
                            <h3>Engineers</h3>
                            <ul>
                                <li>Get matched with high-quality projects.</li>
                                <li>Build reputation through ratings and reviews.</li>
                                <li>Collaborate and network with other engineers.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="real-world-applications" className="fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>Real-world Applications</h2>
                        <p>The platform can be applied to a wide range of projects, connecting engineers from different disciplines.</p>
                    </div>
                    <div className="features">
                        <div className="feature office-construction">
                            <img src="https://content.jdmagicbox.com/v2/comp/hyderabad/f3/040pxx40.xx40.210126142525.f6f3/catalogue/zain-constructions-jangammet-falaknuma-hyderabad-interior-designers-tiwtrn3v51.jpg" alt="Office Construction" loading="lazy" />
                            <h3>Office Construction</h3>
                            <p>Architects, civil, electrical, and communication engineers.</p>
                        </div>
                        <div className="feature smart-cities-development">
                            <img src="https://media.licdn.com/dms/image/D4E12AQGO7QNlIZxz-g/article-cover_image-shrink_720_1280/0/1702613829922?e=2147483647&v=beta&t=gtVdOGSG977FNKB7g86bvoDi0KsU6Oxy6OhNQUi7H2M" alt="Smart Cities Development" loading="lazy" />
                            <h3>Smart Cities Development</h3>
                            <p>Urban planners, engineers, and tech experts.</p>
                        </div>
                        <div className="feature residential-complexes">
                            <img src="https://media.architecturaldigest.com/photos/5729fc9ce50e09d42bdfb402/16:9/w_1920,c_limit/tour-daniel-libeskinds-new-apartment-complex-milan-01.jpg" alt="Residential Complexes" loading="lazy" />
                            <h3>Residential Complexes</h3>
                            <p>Civil, electrical, and mechanical engineers.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="business-model" className="bg-light fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>Business Model</h2>
                        <p>A sustainable business model that offers various pricing options for clients and engineers.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <h3>Subscription Model</h3>
                            <p>Engineers and clients subscribe to premium plans for better features.</p>
                        </div>
                        <div className="feature">
                            <h3>Commission</h3>
                            <p>The platform takes a small percentage from successful project payments.</p>
                        </div>
                        <div className="feature">
                            <h3>Freemium</h3>
                            <p>Basic features are free; advanced tools are available for a fee.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="future-enhancements" className="fade-in">
                <div className="container">
                    <div className="section-header">
                        <h2>Future Enhancements</h2>
                        <p>Continuously evolving to meet the needs of clients and engineers with a focus on innovation and global collaboration.</p>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <h3>Global Expansion</h3>
                            <p>Expand to include engineers from all over the world.</p>
                        </div>
                        <div className="feature">
                            <h3>Advanced AI</h3>
                            <p>Better match engineers based on experience and skills.</p>
                        </div>
                        <div className="feature">
                            <h3>Enhanced Collaboration Tools</h3>
                            <p>Introduce tools for 3D visualization and AR for construction.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="join-uniengineer" className="cta fade-in">
                <div className="container">
                    <h2>Ready to Transform Your Engineering Projects?</h2>
                    <Link to="/login" className="btn">Join UniEngineer Today <i className="fas fa-arrow-right"></i></Link>
                </div>
            </section>

            <button id="back-to-top" className="back-to-top" aria-label="Back to Top">
                <i className="fas fa-arrow-up"></i>
            </button>
        </div>
    );
};

export default Home;
