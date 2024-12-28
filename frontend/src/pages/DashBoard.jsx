import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Button, Popover, Typography, Box, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import jsPDF from 'jspdf';

const BACKENDURI = import.meta.env.VITE_BACKENDURI || 'http://localhost:5000'
const socket = io(BACKENDURI);

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [selectedUserLogs, setSelectedUserLogs] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKENDURI}/api/admin/users`);
        setUsers(response.data);

        // Initialize user statuses
        const initialStatuses = {};
        response.data.forEach(user => {
          initialStatuses[user._id] = 'offline';
        });
        setUserStatuses(initialStatuses);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Listen to socket events for real-time status updates
  useEffect(() => {
    socket.on('user-online', ({ userId }) => {
      setUserStatuses(prevStatuses => ({ ...prevStatuses, [userId]: 'online' }));
    });

    socket.on('user-offline', ({ userId }) => {
      setUserStatuses(prevStatuses => ({ ...prevStatuses, [userId]: 'offline' }));
    });

    // Cleanup on unmount
    return () => {
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, []);

  // Fetch logs for a specific user
  const fetchUserLogs = async (userId, userName) => {
    try {
      const response = await axios.get(`${BACKENDURI}/api/admin/users/${userId}/logs`);
      setSelectedUserLogs(response.data);
      setSelectedUserName(userName);
      setSelectedUserId(userId);
    } catch (err) {
      setError('Failed to fetch user logs');
    }
  };

  // Real-time updates for logs
  socket.on('send-new-location-log', (data) => {
    if (data.userId === selectedUserId) {
      setSelectedUserLogs((prevLogs) => {
        const isDuplicate = prevLogs.some((log) => log.timestamp === data.timestamp);
        if (isDuplicate) return prevLogs;
        return [data, ...prevLogs];
      });
    }
  });

  // Popover logic
  const handleLogClick = (event, log) => {
    setSelectedLocation(log.location);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedLocation(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  // Export logs as PDF
  const exportLogsAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Location Logs for ${selectedUserName}`, 10, 10);
    doc.setFontSize(12);

    selectedUserLogs.forEach((log, index) => {
      const timestamp = new Date(log.timestamp).toLocaleString('en-US', { hour12: true });
      const location = `Latitude: ${log.location.latitude}, Longitude: ${log.location.longitude}`;
      doc.text(`${index + 1}. ${timestamp} - ${location}`, 10, 20 + index * 10);
    });

    doc.save(`${selectedUserName}_Location_Logs.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-6xl text-center font-bold">Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="mt-4 flex">
        {/* User Table */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-semibold">All Users</h2>
          <table className="table-auto border-collapse border w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Username</th>
                <th className="border border-gray-400 px-4 py-2">Email</th>
                <th className="border border-gray-400 px-4 py-2">Status</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-400 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Chip
                      label={userStatuses[user._id] === 'online' ? 'Online' : 'Offline'}
                      color={userStatuses[user._id] === 'online' ? 'success' : 'default'}
                      size="small"
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button variant="contained" onClick={() => fetchUserLogs(user._id, user.username)}>
                      View Logs
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logs Section */}
        <div className="w-1/2 p-4">
          {selectedUserLogs.length > 0 ? (
            <div className="bg-gray-900 p-5 mt-10 rounded-xl">
              <div className="flex justify-between pb-2">
                <h2>Location Logs for {selectedUserName}</h2>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={exportLogsAsPDF}
                  className="mb-4"
                >
                  Export Logs as PDF
                </Button>
              </div>
              {selectedUserLogs.map((log, index) => (
                <div key={index} className="flex p-1">
                  <p className="text-green-500 mr-3">
                    {new Date(log.timestamp).toLocaleString('en-US', { hour12: true })}
                  </p>
                  <p className="mr-3">at</p>
                  <p className="mr-3 text-teal-500">
                    Latitude: {log.location.latitude}, Longitude: {log.location.longitude}
                  </p>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(event) => handleLogClick(event, log)}
                    className="ml-2"
                  >
                    View Map
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No location logs available for {selectedUserName}</p>
          )}
        </div>
      </div>

      {/* Map Popover */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ width: 400, height: 300, p: 2 }}>
          {selectedLocation && (
            <MapContainer
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
                <Popup>Current Location</Popup>
              </Marker>
            </MapContainer>
          )}
        </Box>
      </Popover>
    </div>
  );
}

export default Dashboard;
