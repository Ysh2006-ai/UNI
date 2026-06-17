import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProjectAPI, getProjectsAPI, matchEngineersAPI, assignEngineersAPI } from '../api/projects';
import '../styles/page.css';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [viewState, setViewState] = useState('welcome'); // welcome, form, matching, results
    const [progress, setProgress] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [projectDesc, setProjectDesc] = useState('');
    const [matchedEngineers, setMatchedEngineers] = useState([]);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [myProjects, setMyProjects] = useState([]);
    const [error, setError] = useState('');
    const [loadingProjects, setLoadingProjects] = useState(true);

    const formSectionRef = useRef(null);
    const resultsSectionRef = useRef(null);

    // Fetch user's projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await getProjectsAPI();
            if (data.success) {
                setMyProjects(data.projects);
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handlePostProjectClick = () => {
        setViewState('form');
        setError('');
        setTimeout(() => {
            formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const formData = new FormData(e.target);
        const disciplines = formData.getAll('disciplines');
        
        if (disciplines.length === 0) {
            setError('Please select at least one Engineering Discipline.');
            return;
        }

        const projectData = {
            title: formData.get('projectTitle'),
            description: formData.get('projectDescription'),
            disciplines,
            budget: Number(formData.get('budget')),
            startDate: formData.get('timelineStart'),
            deadline: formData.get('timelineDeadline'),
        };

        try {
            // Create the project
            const createResult = await createProjectAPI(projectData);
            
            if (createResult.success) {
                const projectId = createResult.project._id;
                setCurrentProjectId(projectId);
                
                // Start matchmaking animation
                startMatchmaking(projectId);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project. Please try again.');
        }
    };

    const startMatchmaking = (projectId) => {
        setViewState('matching');
        setProgress(0);
        let currentProgress = 0;
        
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                
                // Fetch matched engineers from API
                matchEngineersAPI(projectId)
                    .then(data => {
                        if (data.success) {
                            setMatchedEngineers(data.engineers);
                        }
                        setViewState('results');
                        setTimeout(() => {
                            resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    })
                    .catch(err => {
                        console.error('Match error:', err);
                        setError('Failed to match engineers. Please try again.');
                        setViewState('form');
                    });
            }
            setProgress(currentProgress);
        }, 800);
    };

    const handleProceedTeam = async () => {
        if (!currentProjectId || matchedEngineers.length === 0) return;

        try {
            const engineerIds = matchedEngineers.map(e => e._id);
            await assignEngineersAPI(currentProjectId, engineerIds);
            setShowSuccessModal(true);
            fetchProjects(); // Refresh project list
        } catch (err) {
            setError('Failed to assign team. Please try again.');
        }
    };

    const generateStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let stars = [];
        for (let i = 0; i < fullStars; i++) stars.push('⭐');
        if (halfStar) stars.push('⭐️');
        return stars.join('');
    };

    const getStatusBadge = (status) => {
        const colors = {
            'open': '#007acc',
            'matching': '#f39c12',
            'in-progress': '#00a86b',
            'completed': '#6c757d'
        };
        return (
            <span style={{
                background: colors[status] || '#999',
                color: '#fff',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="client-dashboard-body">
            <header className="header">
                <div className="logo">
                    <img src="/logo.png" alt="UNI Logo" id="uni-logo" />
                    <span className="logo-sub">Unified Engineering Platform</span>
                </div>
                <nav className="nav-menu">
                    <a href="/" className="nav-link">Home</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setViewState('welcome'); }}>Dashboard</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('my-projects')?.scrollIntoView({ behavior: 'smooth' }); }}>Projects</a>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </nav>
            </header>

            {showLogoutModal && (
                <div className="modal" id="logout-modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Logout</h2>
                        <p style={{ margin: '15px 0', color: '#666' }}>Are you sure you want to log out?</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="modal-ok-btn" onClick={confirmLogout}>Yes, Logout</button>
                            <button className="modal-ok-btn" style={{ background: '#999' }} onClick={() => setShowLogoutModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="modal" id="success-modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎉</div>
                        <h2>Team Assigned Successfully!</h2>
                        <p style={{ margin: '15px 0', color: '#666' }}>Your project is now in progress with the selected engineers.</p>
                        <button className="modal-ok-btn" onClick={() => { setShowSuccessModal(false); setViewState('welcome'); }}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            <main className="main-content">
                <section className="welcome-section">
                    <h1>Welcome, <span id="username-display">{user?.name || 'User'}</span>! Let's begin your project.</h1>
                    <button className="post-project-btn" onClick={handlePostProjectClick}>
                        <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i>
                        Post a New Project
                    </button>
                </section>

                {/* My Projects Section */}
                <section id="my-projects" style={{ width: '100%', maxWidth: '800px', marginBottom: '40px' }}>
                    <h2 style={{ textAlign: 'center', color: '#007acc', marginBottom: '20px', fontFamily: "'Montserrat', sans-serif" }}>
                        <i className="fas fa-folder-open" style={{ marginRight: '10px' }}></i>
                        My Projects
                    </h2>
                    {loadingProjects ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>
                            <i className="fas fa-spinner fa-spin"></i> Loading projects...
                        </p>
                    ) : myProjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '15px' }}></i>
                            <p style={{ color: '#999', fontSize: '1.1rem' }}>No projects yet. Post your first project to get started!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {myProjects.map(project => (
                                <div key={project._id} style={{
                                    background: '#fff',
                                    borderRadius: '12px',
                                    padding: '20px 25px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    border: '1px solid #f0f0f0',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h3 style={{ color: '#333', fontSize: '1.1rem', margin: 0 }}>{project.title}</h3>
                                        {getStatusBadge(project.status)}
                                    </div>
                                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '8px' }}>
                                        Budget: ${project.budget?.toLocaleString()} | 
                                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {project.disciplines?.map((d, i) => (
                                            <span key={i} style={{
                                                background: 'rgba(0, 122, 204, 0.1)',
                                                color: '#007acc',
                                                padding: '2px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem'
                                            }}>{d}</span>
                                        ))}
                                    </div>
                                    {project.assignedEngineers?.length > 0 && (
                                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <i className="fas fa-users" style={{ color: '#00a86b', marginRight: '5px' }}></i>
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                                {project.assignedEngineers.length} engineer{project.assignedEngineers.length > 1 ? 's' : ''} assigned
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {error && (
                    <div style={{
                        background: 'rgba(255, 77, 79, 0.1)',
                        border: '1px solid rgba(255, 77, 79, 0.3)',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        marginBottom: '20px',
                        color: '#d32f2f',
                        textAlign: 'center',
                        maxWidth: '800px',
                        width: '100%'
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                        {error}
                    </div>
                )}

                {(viewState === 'form' || viewState === 'matching' || viewState === 'results') && (
                    <section className="project-form-section" id="project-form-section" ref={formSectionRef} style={{ display: viewState === 'matching' ? 'none' : 'block' }}>
                        <h2>Post a New Project</h2>
                        <form id="project-form" onSubmit={handleFormSubmit}>
                            <label htmlFor="project-title">Project Title</label>
                            <input type="text" id="project-title" name="projectTitle" required placeholder="e.g., Build a Smart City Infrastructure" />

                            <label htmlFor="project-description">Project Description</label>
                            <textarea
                                id="project-description"
                                name="projectDescription"
                                rows="5"
                                required
                                placeholder="Provide a detailed description of your project..."
                                maxLength={1000}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            ></textarea>
                            <p id="char-counter" style={{ fontSize: '0.85rem', color: '#999', textAlign: 'right' }}>{projectDesc.length}/1000</p>

                            <label>Engineering Disciplines</label>
                            <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', background: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
                                {['Civil', 'Mechanical', 'Electrical', 'Software', 'Structural', 'Chemical', 'Aerospace', 'Biomedical', 'Industrial', 'Petroleum', 'Computer', 'Nuclear', 'Marine', 'Systems', 'Automotive', 'Agricultural', 'Materials', 'Robotics', 'Geotechnical', 'Telecommunications', 'Mining', 'Energy', 'Mechatronics', 'Data'].map(d => (
                                    <label key={d} style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input type="checkbox" name="disciplines" value={d} style={{ accentColor: '#007acc' }} /> {d}
                                    </label>
                                ))}
                            </div>

                            <label htmlFor="budget">Budget ($)</label>
                            <input type="number" id="budget" name="budget" required placeholder="Enter your budget" min="1" />

                            <label htmlFor="timeline-start">Start Date</label>
                            <input type="date" id="timeline-start" name="timelineStart" required />

                            <label htmlFor="timeline-deadline">Deadline</label>
                            <input type="date" id="timeline-deadline" name="timelineDeadline" required />

                            <button type="submit" className="submit-btn">
                                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                                Find Engineers
                            </button>
                        </form>
                    </section>
                )}

                {viewState === 'matching' && (
                    <section className="matchmaking-section" id="matchmaking-section" style={{ width: '100%', maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                        <div className="loading-container">
                            <div className="robot-animation-container">
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUUglUp-hsyK6ZEq671yOtKhCkJRUOUjHgREyNpz_7njgggIspTF-kMbDxQxQE65PCO5LiME5RJpthduRWq9ACqPF1nJYcfGveNrhq4tXkk1sMbPrIXHIPN-sftVH1FXVMtYg_soaVCCo/s640/dr_3.gif" alt="AI Robot" className="robot-animation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="loading-animation">
                                <span className="loading-text" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#007acc' }}>AI is finding your best engineers...</span>
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" id="matching-progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="progress-text" id="progress-text" style={{ textAlign: 'center', marginTop: '10px', fontWeight: 600, color: '#333' }}>Matching {progress}%</div>
                    </section>
                )}

                {viewState === 'results' && (
                    <section className="results-section" id="results-section" ref={resultsSectionRef} style={{ width: '100%', maxWidth: '900px', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                        <h2>Matched Engineers</h2>
                        <div className="engineer-profiles" id="engineer-profiles">
                            {matchedEngineers.map((eng, index) => (
                                <div className="engineer-profile" key={eng._id || index}>
                                    <img 
                                        src={eng.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(eng.name)}&background=007acc&color=fff&size=100`} 
                                        alt={eng.name} 
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(eng.name)}&background=007acc&color=fff&size=100`; }}
                                    />
                                    <h3>{eng.name}</h3>
                                    <p>Specialization: {eng.specialization}</p>
                                    <p>Experience: {eng.experience}</p>
                                    <p className="ratings">Rating: {generateStars(eng.ratings)}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{eng.bio}</p>
                                    {eng.badges?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                                            {eng.badges.map((badge, i) => (
                                                <span key={i} style={{ background: '#f39c12', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{badge}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="proceed-team-btn" onClick={handleProceedTeam}>
                            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                            Proceed with this Team
                        </button>
                    </section>
                )}
            </main>
        </div>
    );
};

export default ClientDashboard;
