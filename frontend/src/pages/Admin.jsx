import React, { useState } from 'react';
import axios from 'axios';
import DashBoard from './DashBoard';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        console.log('Admin logged in successfully');
        alert('Admin logged in successfully');
        setError('');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (isLoggedIn) {
    return <DashBoard />; // Replace this with your admin dashboard
  }

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Admin;
