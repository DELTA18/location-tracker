import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Button from '@mui/material/Button';

const socket = io('http://localhost:5000');

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserLogs, setSelectedUserLogs] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
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
  const fetchUserLogs =  async(userId, userName) => {

    try {
            const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/logs`);
            setSelectedUserLogs(response.data);
            setSelectedUserName(userName);
            setSelectedUserId(userId);
          } catch (err) {
            setError('Failed to fetch user logs');
          }
    // setInterval(async () => {
        
    //     try {
    //       const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/logs`);
    //       setSelectedUserLogs(response.data);
    //       setSelectedUserName(userName);
    //       setSelectedUserId(userId);
    //       setSelectedUserId(userId);
    //     } catch (err) {
    //       setError('Failed to fetch user logs');
    //     }
    // }, 4000);
  };

  socket.on('send-new-location-log', (data) => {

    if (data.userId === selectedUserId) {
      setSelectedUserLogs((prevLogs) => {
        // Check if the timestamp already exists in the logs
        const isDuplicate = prevLogs.some((log) => log.timestamp === data.timestamp);
        if (isDuplicate) {
          return prevLogs; // Return the array as is if timestamp exists
        }
        console.log('Received new location log:', data);
        return [data, ...prevLogs]; // Add the new log at the start
      });
    }
  });
  

    // setInterval(() => {
    //     console.log('------',selectedUserLogs )
    // }, 2000);


  return (
    <div className="container mx-auto p-4">
      <h1 className='text-6xl text-center font-bold'>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className='mt-4 flex' >
        <div className='w-1/2 p-4'>

        <h2 className='text-2xl font-semibold'>All Users</h2>
        <table className="table-auto border-collapse border w-full ">
  <thead>
    <tr>
      <th className="border border-gray-400 px-4 py-2">Username</th>
      <th className="border border-gray-400 px-4 py-2">Email</th>
      <th className="border border-gray-400 px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user._id}>
        <td className="border border-gray-400 px-4 py-2">{user.username}</td>
        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
        <td className="border border-gray-400 px-4 py-2">
          <Button variant="outlined" onClick={() => fetchUserLogs(user._id, user.username)} >View Logs</Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>


        {/* <DataGrid rows={rows} columns={columns} /> */}
      
    <div>
      {selectedUserLogs.length > 0 ? ( 
        <div className='  bg-gray-900 p-5 border-gray-600 rounded-xl'>
          <h2>Location Logs for {selectedUserName}</h2>
          
            {selectedUserLogs.map((log, index) => (
              <div key={index} className='flex'>
                {log.location.latitude}, {log.location.longitude} at {new Date(log.timestamp).toLocaleString()}
              </div>
            ))}
          
        </div>
      ) : (
        <p>No location logs available for {selectedUserName}</p>
      )}

    </div>
      </div>
    </div>
  );
}

export default Dashboard;
