# UNI - Unified Engineering Platform

UNI is a modern platform designed to bridge the gap between clients and engineers, facilitating seamless project collaboration, matchmaking, and management.

## 🚀 Features

- **Client Dashboard**: 
  - Post new projects with detailed requirements.
  - "Robot Matchmaking" to find the perfect engineer.
  - View potential candidates with profiles and ratings.
- **Engineer Dashboard**:
  - Kanban-style task management (Drag & Drop).
  - Project file management.
  - Real-time messaging interface.
  - Profile customization.
- **Modern UI/UX**:
  - Glassmorphism design aesthetic.
  - Dark Mode support.
  - Responsive layout for all devices.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, React Router DOM
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: MongoDB (supports in-memory dev mode & external database)
- **Styling**: CSS3 (Glassmorphism, Flexbox/Grid), FontAwesome

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/uni-platform.git
   cd uni-platform
   ```

2. **Install All Dependencies (Root, Client, and Server)**:
   From the project root directory, run:
   ```bash
   npm install && npm run install:all
   ```

3. **Run the Full-Stack Application**:
   Starts both the frontend and backend servers concurrently:
   ```bash
   npm run dev
   ```

## 📋 Demo Accounts

You can log in and test all user flows immediately using these pre-seeded accounts:

### Client Portal
* **Email**: `client@demo.com`
* **Password**: `password123`

### Engineer Portal
* **Email**: `rajesh@demo.com` or `neha@demo.com`
* **Password**: `password123`

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the code.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
