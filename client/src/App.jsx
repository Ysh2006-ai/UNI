import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import ClientDashboard from './pages/ClientDashboard';
import EngineerDashboard from './pages/EngineerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
    </Routes>
  );
}

export default App;
