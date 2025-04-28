import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerHome from './components/CustomerHome';
import WaitScreen from './components/WaitScreen';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/home');
    } catch (error) {
      alert(error.response?.data?.msg || 'Login failed');
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.msg || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/home" element={<CustomerHome user={user} onLogout={handleLogout} />} />
      <Route path="/wait" element={<WaitScreen user={user} onLogout={handleLogout} />} />
      <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;