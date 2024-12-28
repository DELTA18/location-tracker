import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Box, Typography, Button, Paper } from '@mui/material';

const BACKENDURI = import.meta.env.VITE_BACKENDURI || 'http://localhost:5000'
const socket = io(BACKENDURI);

function Home() {
  const location = useLocation();
  const userId = location.state?.userId; 
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [intervalId, setIntervalId] = useState(null);  

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing');
    }
  }, [userId]);

  const startTracking = () => {
    if (!userId) return;

    if (isTracking) {
      // Stop tracking
      socket.emit('user-offline', { userId });
      setIsTracking(false);
      clearInterval(intervalId); // Clear the interval when stopping
      setIntervalId(null);  // Reset the interval ID
    } else {
      // Start tracking
      setIsTracking(true);
      socket.emit('user-online', { userId });

      const newIntervalId = setInterval(async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const data = {
                  userId,
                  location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                };
                await axios.post(`${BACKENDURI}/api/location`, data);
                socket.emit('new-location-log', data);
                setLocationData(position.coords);
              } catch (error) {
                console.error('Error sending location:', error);
              }
            },
            (error) => console.error('Error getting location:', error),
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        }
      }, 4000); // Continue sending location every 4 seconds

      setIntervalId(newIntervalId);  // Store the interval ID in state

      // Stop tracking after 1 minute
      setTimeout(() => {
        clearInterval(newIntervalId);
        setIsTracking(false);
        socket.emit('user-offline', { userId });
      }, 60000); // Automatically stop after 1 minute
    }
  };

  return (
    <Box className="h-[100vh] flex justify-center bg-[#f5f4f4] items-center">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Home Page
        </Typography>
        <Button
          variant="contained"
          color={isTracking ? 'secondary' : 'primary'}
          onClick={startTracking}
          fullWidth
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Button>
        {locationData && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Location
            </Typography>
            <Typography variant="body2">Latitude: {locationData.latitude}</Typography>
            <Typography variant="body2">Longitude: {locationData.longitude}</Typography>
            <Typography variant="body2">Timestamp: {new Date().toLocaleString()}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Home;
