import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectsAPI } from '../api/projects';
import { getTasksAPI, updateTaskAPI, createTaskAPI } from '../api/tasks';
import { getMessagesAPI, sendMessageAPI } from '../api/messages';
import { updateEngineerProfileAPI } from '../api/engineers';
import '../styles/eng.css';

const EngineerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [profileData, setProfileData] = useState({
        bio: user?.bio || '',
        skills: user?.skills?.join(', ') || '',
        experience: user?.experience || '',
    });
    const [profileSaveMsg, setProfileSaveMsg] = useState('');
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Fetch data on mount
    useEffect(() => {
        fetchProjects();
        fetchTasks();
    }, []);

    const fetchProjects = async () => {
        try {
            // Fetch assigned projects
            const assignedData = await getProjectsAPI('assigned');
            if (assignedData.success) {
                setAssignedProjects(assignedData.projects);
                if (assignedData.projects.length > 0 && !activeProjectId) {
                    setActiveProjectId(assignedData.projects[0]._id);
                }
            }

            // Fetch available projects
            const availableData = await getProjectsAPI();
            if (availableData.success) {
                setAvailableProjects(availableData.projects);
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const fetchTasks = async () => {
        try {
            const data = await getTasksAPI();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    // Fetch messages when active project changes
    useEffect(() => {
        if (activeProjectId) {
            fetchMessages();
        }
    }, [activeProjectId]);

    const fetchMessages = async () => {
        if (!activeProjectId) return;
        setLoadingMessages(true);
        try {
            const data = await getMessagesAPI(activeProjectId);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e, taskId, sourceColumn) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(0, 122, 204, 0.05)';
    };

    const handleDragLeave = (e) => {
        e.currentTarget.style.background = '';
    };

    const handleDrop = async (e, targetColumn) => {
        e.preventDefault();
        e.currentTarget.style.background = '';
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const task = tasks[sourceColumn].find(t => t._id === taskId);
        if (!task) return;

        // Optimistic update
        const newSourceList = tasks[sourceColumn].filter(t => t._id !== taskId);
        const newTargetList = [...tasks[targetColumn], { ...task, status: targetColumn }];

        setTasks({
            ...tasks,
            [sourceColumn]: newSourceList,
            [targetColumn]: newTargetList
        });

        // API call
        try {
            await updateTaskAPI(taskId, { status: targetColumn });
        } catch (err) {
            console.error('Failed to update task:', err);
            // Revert on error
            fetchTasks();
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeProjectId) return;

        const tempMsg = {
            _id: 'temp-' + Date.now(),
            sender: { name: user?.name || 'Me', _id: user?.id },
            content: newMessage,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        try {
            await sendMessageAPI(activeProjectId, newMessage);
            fetchMessages(); // Refresh to get real message
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const projectId = assignedProjects[0]?._id || activeProjectId;
            if (!projectId) return;

            await createTaskAPI({
                title: newTaskTitle,
                project: projectId,
                assignedTo: user?.id
            });

            setNewTaskTitle('');
            setShowNewTaskForm(false);
            fetchTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileSaveMsg('');

        try {
            const updateData = {
                bio: profileData.bio,
                skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience: profileData.experience
            };

            await updateEngineerProfileAPI(user?.id, updateData);
            setProfileSaveMsg('✅ Profile updated successfully!');
            setTimeout(() => setProfileSaveMsg(''), 3000);
        } catch (err) {
            setProfileSaveMsg('❌ Failed to update profile.');
            console.error('Profile update error:', err);
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="engineer-dashboard-body">
            <header>
                <div className="logo">
                    <a href="/" className="logo-link">
                        <img src="/logo.png" alt="UNI Logo" className="logo-img" />
                        <span className="logo-sub">Unified Engineering Platform</span>
                    </a>
                </div>
                <nav>
                    <ul>
                        <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); scrollToSection('dashboard'); }}>Dashboard</a></li>
                        <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
                        <li><a href="#tasks" onClick={(e) => { e.preventDefault(); scrollToSection('tasks'); }}>Tasks</a></li>
                        <li><a href="#messages" onClick={(e) => { e.preventDefault(); scrollToSection('messages'); }}>Messages</a></li>
                        <li><a href="#profile" onClick={(e) => { e.preventDefault(); scrollToSection('profile'); }}>Profile</a></li>
                    </ul>
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="notifications">
                        <i className="fas fa-bell"></i>
                        <span className="notification-count">{assignedProjects.length}</span>
                    </div>
                    <button onClick={handleLogout} style={{
                        padding: '6px 16px',
                        border: 'none',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #ff4d4f, #d32f2f)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'transform 0.2s'
                    }}>Logout</button>
                </div>
            </header>

            <main>
                <section id="dashboard" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Welcome, {user?.name || 'Engineer'}</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div className="assigned-projects">
                            <h3><i className="fas fa-briefcase" style={{ marginRight: '8px', color: '#007acc' }}></i>Assigned Projects</h3>
                            {assignedProjects.length === 0 ? (
                                <p style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No assigned projects yet.</p>
                            ) : (
                                <ul className="project-list">
                                    {assignedProjects.map(project => (
                                        <li className="project-card" key={project._id}>
                                            <div className="project-icon"><i className="fas fa-building"></i></div>
                                            <div className="project-details">
                                                <h4>{project.title}</h4>
                                                <p>Client: {project.client?.name || 'N/A'}</p>
                                                <p>Start Date: {formatDate(project.startDate)}</p>
                                                <p>Status: <span style={{ color: '#00a86b', fontWeight: 600, textTransform: 'capitalize' }}>{project.status}</span></p>
                                                <p>Deadline: {formatDate(project.deadline)}</p>
                                            </div>
                                            <a href="#projects" className="btn view-project-btn" onClick={(e) => { e.preventDefault(); setActiveProjectId(project._id); scrollToSection('projects'); }}>View Project</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="available-projects" style={{ marginTop: '30px' }}>
                            <h3><i className="fas fa-globe" style={{ marginRight: '8px', color: '#00a86b' }}></i>Available Projects</h3>
                            {availableProjects.length === 0 ? (
                                <p style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No available projects at the moment.</p>
                            ) : (
                                <ul className="project-list">
                                    {availableProjects.slice(0, 5).map(project => (
                                        <li className="project-card" key={project._id}>
                                            <div className="project-icon"><i className="fas fa-city"></i></div>
                                            <div className="project-details">
                                                <h4>{project.title}</h4>
                                                <p>Disciplines: {project.disciplines?.join(', ')}</p>
                                                <p>Budget: ${project.budget?.toLocaleString()}</p>
                                                <p>Start Date: {formatDate(project.startDate)}</p>
                                            </div>
                                            <a href="#" className="btn apply-btn" onClick={(e) => e.preventDefault()}>Apply Now</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>

                <section id="projects" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Project Workspace</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div className="project-files">
                            <h3><i className="fas fa-file-alt" style={{ marginRight: '8px', color: '#007acc' }}></i>Project Files</h3>
                            <ul className="file-list">
                                <li className="file-card">
                                    <div className="file-icon"><i className="fas fa-file-pdf"></i></div>
                                    <div className="file-details"><p>design_v2.pdf</p></div>
                                    <a href="#" className="btn download-btn" onClick={(e) => e.preventDefault()}>Download</a>
                                </li>
                                <li className="file-card">
                                    <div className="file-icon"><i className="fas fa-file-image"></i></div>
                                    <div className="file-details"><p>floor_plan.dwg</p></div>
                                    <a href="#" className="btn download-btn" onClick={(e) => e.preventDefault()}>Download</a>
                                </li>
                            </ul>
                            <div className="upload-file">
                                <input type="file" id="fileUpload" style={{ display: 'none' }} />
                                <label htmlFor="fileUpload" className="btn upload-btn">
                                    <i className="fas fa-upload" style={{ marginRight: '5px' }}></i> Upload File
                                </label>
                            </div>
                        </div>
                        <div className="project-timeline" style={{ marginTop: '30px' }}>
                            <h3><i className="fas fa-clock" style={{ marginRight: '8px', color: '#f39c12' }}></i>Project Timeline</h3>
                            {assignedProjects.length > 0 && (
                                <div className="milestone">
                                    <div className="milestone-icon"><i className="fas fa-flag"></i></div>
                                    <div className="milestone-details">
                                        <h4>{assignedProjects[0].title}</h4>
                                        <p>Deadline: {formatDate(assignedProjects[0].deadline)}</p>
                                        <div className="progress-bar">
                                            <div className="progress" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="tasks" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Task Management</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                            {!showNewTaskForm ? (
                                <button className="btn" style={{ background: '#00a86b', color: '#fff' }} onClick={() => setShowNewTaskForm(true)}>
                                    <i className="fas fa-plus" style={{ marginRight: '5px' }}></i> Add Task
                                </button>
                            ) : (
                                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Task title..."
                                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
                                        autoFocus
                                    />
                                    <button type="submit" className="btn" style={{ background: '#00a86b', color: '#fff' }}>Add</button>
                                    <button type="button" className="btn" style={{ background: '#999', color: '#fff' }} onClick={() => setShowNewTaskForm(false)}>Cancel</button>
                                </form>
                            )}
                        </div>
                        <div className="task-board">
                            {['todo', 'inProgress', 'completed'].map(col => (
                                <div
                                    className="task-column"
                                    key={col}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, col)}
                                >
                                    <h3>
                                        {col === 'todo' ? '📋 To Do' : col === 'inProgress' ? '🔧 In Progress' : '✅ Completed'}
                                        <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: '#999' }}>({tasks[col].length})</span>
                                    </h3>
                                    <ul className="task-list" id={`${col}List`}>
                                        {loadingTasks ? (
                                            <li style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                                <i className="fas fa-spinner fa-spin"></i> Loading...
                                            </li>
                                        ) : tasks[col].length === 0 ? (
                                            <li style={{ textAlign: 'center', padding: '20px', color: '#ccc', fontSize: '0.9rem' }}>
                                                No tasks here
                                            </li>
                                        ) : (
                                            tasks[col].map(task => (
                                                <li
                                                    className="task-card"
                                                    draggable="true"
                                                    key={task._id}
                                                    onDragStart={(e) => handleDragStart(e, task._id, col)}
                                                    style={{ cursor: 'grab' }}
                                                >
                                                    <div className="task-icon"><i className="fas fa-tasks"></i></div>
                                                    <div className="task-details">
                                                        <h4>{task.title}</h4>
                                                        <p>Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
                                                        <p>Due: {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}</p>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="messages" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Messages</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        {assignedProjects.length > 1 && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {assignedProjects.map(p => (
                                    <button
                                        key={p._id}
                                        className="btn"
                                        style={{
                                            background: activeProjectId === p._id ? '#007acc' : '#e0e0e0',
                                            color: activeProjectId === p._id ? '#fff' : '#333'
                                        }}
                                        onClick={() => setActiveProjectId(p._id)}
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="message-container">
                            <div className="message-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {!activeProjectId ? (
                                    <p style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        <i className="fas fa-comments" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                                        No project selected for messaging.
                                    </p>
                                ) : loadingMessages ? (
                                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                                        <i className="fas fa-spinner fa-spin"></i> Loading messages...
                                    </p>
                                ) : messages.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        No messages yet. Start the conversation!
                                    </p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {messages.map((msg, i) => (
                                            <li className="message" key={msg._id || i}>
                                                <div className="message-icon">
                                                    <i className="fas fa-user-circle" style={{ fontSize: '1.5rem', color: msg.sender?._id === user?.id ? '#00a86b' : '#007acc' }}></i>
                                                </div>
                                                <div className="message-details">
                                                    <div className="message-header">
                                                        <span className="sender" style={{ color: msg.sender?._id === user?.id ? '#00a86b' : '#007acc' }}>
                                                            {msg.sender?._id === user?.id ? 'You' : (msg.sender?.name || 'Unknown')}
                                                        </span>
                                                        <span className="timestamp">
                                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                    <div className="message-content">
                                                        <p>{msg.content}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {activeProjectId && (
                                <div className="message-input">
                                    <textarea
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                    ></textarea>
                                    <button className="btn send-btn" onClick={handleSendMessage}>
                                        <i className="fas fa-paper-plane" style={{ marginRight: '5px' }}></i> Send
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="profile" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Engineer Profile</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div className="profile-info">
                            <div className="profile-picture-container">
                                <img 
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'E')}&background=007acc&color=fff&size=120`} 
                                    alt="Profile" 
                                    className="profile-picture" 
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'E')}&background=007acc&color=fff&size=120`; }}
                                />
                            </div>
                            <div className="profile-details">
                                <h3>{user?.name || 'Engineer'}</h3>
                                <p>{user?.specialization || 'Engineer'}</p>
                                <p>Experience: {user?.experience || 'Not specified'}</p>
                                <div className="badges">
                                    {user?.badges?.map((badge, i) => (
                                        <span className="badge" key={i}>{badge}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="profile-edit">
                            <h3>Edit Profile</h3>
                            {profileSaveMsg && (
                                <p style={{ marginBottom: '10px', fontWeight: 600, color: profileSaveMsg.startsWith('✅') ? '#00a86b' : '#d32f2f' }}>
                                    {profileSaveMsg}
                                </p>
                            )}
                            <form id="profileForm" onSubmit={handleProfileUpdate}>
                                <label htmlFor="bio">Bio:</label>
                                <textarea 
                                    id="bio" 
                                    rows="4" 
                                    placeholder="Tell us about yourself..." 
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                ></textarea>

                                <label htmlFor="skills">Skills (comma separated):</label>
                                <input 
                                    type="text" 
                                    id="skills" 
                                    placeholder="e.g., JavaScript, Python, AutoCAD" 
                                    value={profileData.skills}
                                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                />

                                <label htmlFor="experience">Experience:</label>
                                <input 
                                    type="text" 
                                    id="experience" 
                                    placeholder="e.g., 5 years" 
                                    value={profileData.experience}
                                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                />

                                <button type="submit" className="btn save-btn">
                                    <i className="fas fa-save" style={{ marginRight: '5px' }}></i> Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <footer>
                    <p>&copy; 2026 UNI - Unified Engineering Platform. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default EngineerDashboard;
