import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserLogs, setSelectedUserLogs] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [error, setError] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Fetch logs for a specific user
  const fetchUserLogs = async (userId, userName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/logs`);
      setSelectedUserLogs(response.data);
      setSelectedUserName(userName);
    } catch (err) {
      setError('Failed to fetch user logs');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <h2>All Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email}){' '}
              <button onClick={() => fetchUserLogs(user._id, user.name)}>View Logs</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUserLogs.length > 0 && (
        <div>
          <h2>Location Logs for {selectedUserName}</h2>
          <ul>
            {selectedUserLogs.map((log, index) => (
              <li key={index}>
                {log.location.latitude}, {log.location.longitude} at {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
