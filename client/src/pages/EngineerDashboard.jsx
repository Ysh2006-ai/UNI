import React, { useState, useEffect } from 'react';
import '../styles/eng.css';

const EngineerDashboard = () => {
    const [tasks, setTasks] = useState({
        todo: [
            { id: 't1', title: 'Task 1', assignedTo: 'Engineer Name', dueDate: 'DD/MM/YYYY' },
            // Add more if needed
        ],
        inProgress: [],
        completed: []
    });

    const [messages, setMessages] = useState([
        { sender: 'Koushik', time: '10:30 AM', content: 'Hey, can you review the latest design changes?' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const [projectUpdates, setProjectUpdates] = useState([]);

    useEffect(() => {
        // Mock fetch updates
        setTimeout(() => {
            setProjectUpdates([
                { id: 1, message: 'New project file added: design_v2.pdf' },
                { id: 2, message: 'Project timeline updated' },
                { id: 3, message: 'New task assigned: Review design' },
            ]);
        }, 1000);
    }, []);

    // Drag and Drop Handlers
    const handleDragStart = (e, taskId, sourceColumn) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetColumn) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const task = tasks[sourceColumn].find(t => t.id === taskId);
        const newSourceList = tasks[sourceColumn].filter(t => t.id !== taskId);
        const newTargetList = [...tasks[targetColumn], task];

        setTasks({
            ...tasks,
            [sourceColumn]: newSourceList,
            [targetColumn]: newTargetList
        });

        console.log(`Task ${taskId} moved to ${targetColumn}`);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg = {
            sender: 'Me',
            time: new Date().toLocaleTimeString(),
            content: newMessage
        };
        // Mock delay
        setTimeout(() => {
            setMessages([...messages, msg]);
            setNewMessage('');
        }, 500);
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Mock update
        alert('Profile updated successfully');
    }

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

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
                <div className="notifications">
                    <i className="fas fa-bell"></i>
                    <span className="notification-count">3</span>
                </div>
            </header>

            <main>
                <section id="dashboard" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Engineer Dashboard</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div className="assigned-projects">
                            <h3>Assigned Projects</h3>
                            <ul className="project-list">
                                <li className="project-card">
                                    <div className="project-icon"><i className="fas fa-building"></i></div>
                                    <div className="project-details">
                                        <h4>Project Title 1</h4>
                                        <p>Client: Client Name</p>
                                        <p>Start Date: DD/MM/YYYY</p>
                                        <p>Status: In Progress</p>
                                        <p>Deadline: DD/MM/YYYY</p>
                                    </div>
                                    <a href="#" className="btn view-project-btn">View Project</a>
                                </li>
                            </ul>
                        </div>
                        <div className="available-projects">
                            <h3>Available Projects</h3>
                            <ul className="project-list">
                                <li className="project-card">
                                    <div className="project-icon"><i className="fas fa-city"></i></div>
                                    <div className="project-details">
                                        <h4>Project Title 2</h4>
                                        <p>Required Disciplines: Discipline 1, Discipline 2</p>
                                        <p>Budget: $X,XXX</p>
                                        <p>Start Date: DD/MM/YYYY</p>
                                    </div>
                                    <a href="#" className="btn apply-btn">Apply Now</a>
                                </li>
                            </ul>
                        </div>
                        {/* Mock Updates Display if needed based on eng.js logic (fetchProjectUpdates) */}
                        <div className="project-updates">
                            <h3>Recent Updates</h3>
                            <ul id="projectUpdates">
                                {projectUpdates.map(u => <li key={u.id}>{u.message}</li>)}
                            </ul>
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
                            <h3>Project Files</h3>
                            <ul className="file-list">
                                <li className="file-card">
                                    <div className="file-icon"><i className="fas fa-file-alt"></i></div>
                                    <div className="file-details"><p>File Name 1</p></div>
                                    <a href="#" className="btn download-btn">Download</a>
                                </li>
                            </ul>
                            <div className="upload-file">
                                <input type="file" id="fileUpload" />
                                <label htmlFor="fileUpload" className="btn upload-btn">Upload File</label>
                            </div>
                        </div>
                        <div className="project-timeline">
                            <h3>Project Timeline</h3>
                            <div className="milestone">
                                <div className="milestone-icon"><i className="fas fa-flag"></i></div>
                                <div className="milestone-details">
                                    <h4>Milestone 1</h4>
                                    <p>Due Date: DD/MM/YYYY</p>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tasks" className="section">
                    <div className="section-header">
                        <h2 className="section-title">Task Management</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="section-content">
                        <div className="task-board">
                            {['todo', 'inProgress', 'completed'].map(col => (
                                <div
                                    className="task-column"
                                    key={col}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, col)}
                                >
                                    <h3>{col === 'todo' ? 'To Do' : col === 'inProgress' ? 'In Progress' : 'Completed'}</h3>
                                    <ul className="task-list" id={`${col}List`}>
                                        {tasks[col].map(task => (
                                            <li
                                                className="task-card"
                                                draggable="true"
                                                key={task.id}
                                                onDragStart={(e) => handleDragStart(e, task.id, col)}
                                            >
                                                <div className="task-icon"><i className="fas fa-tasks"></i></div>
                                                <div className="task-details">
                                                    <h4>{task.title}</h4>
                                                    <p>Assigned to: {task.assignedTo}</p>
                                                    <p>Due Date: {task.dueDate}</p>
                                                </div>
                                            </li>
                                        ))}
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
                        <div className="message-container">
                            <div className="message-list">
                                <ul>
                                    {messages.map((msg, i) => (
                                        <li className="message" key={i}>
                                            <div className="message-icon"><i className="fas fa-user"></i></div>
                                            <div className="message-details">
                                                <div className="message-header">
                                                    <span className="sender">{msg.sender}</span>
                                                    <span className="timestamp">{msg.time}</span>
                                                </div>
                                                <div className="message-content">
                                                    <p>{msg.content}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="message-input">
                                <textarea
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                ></textarea>
                                <button className="btn send-btn" onClick={handleSendMessage}>Send</button>
                            </div>
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
                                <img src="https://t4.ftcdn.net/jpg/06/29/70/17/360_F_629701706_MLzbqraLbTFUppqudeTxXsoVrL3cm3k3.jpg" alt="Profile Picture" className="profile-picture" />
                            </div>
                            <div className="profile-details">
                                <h3>Kranthi</h3>
                                <p>Electrical Engineer</p>
                                <p>Experience: 5 years</p>
                                <div className="badges">
                                    <span className="badge">Verified</span>
                                    <span className="badge">Top Performer</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-edit">
                            <h3>Edit Profile</h3>
                            <form id="profileForm" onSubmit={handleProfileUpdate}>
                                <label htmlFor="bio">Bio:</label>
                                <textarea id="bio" rows="4" placeholder="Tell us about yourself..."></textarea>

                                <label htmlFor="skills">Skills:</label>
                                <input type="text" id="skills" placeholder="e.g., JavaScript, Python" />

                                <label htmlFor="experience">Experience:</label>
                                <input type="text" id="experience" placeholder="e.g., 5 years" />

                                <label htmlFor="portfolio">Portfolio:</label>
                                <input type="file" id="portfolio" />

                                <button type="submit" className="btn save-btn">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </section>

                <footer>
                    <p>&copy; 2023 UNI - Unified Engineering Platform. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default EngineerDashboard;
