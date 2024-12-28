import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Box, Typography, Button, Paper } from '@mui/material';

const socket = io('http://localhost:5000');

function Home() {
  const location = useLocation();
  const userId = location.state?.userId; // Access userId passed from Auth.js
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing');
    }
  }, [userId]);

  const startTracking = () => {
    if (!userId) return;
    if (isTracking){
        socket.emit('user-offline', { userId });
        setIsTracking(false);
    }
    else{
        setIsTracking(true);
        socket.emit('user-online', { userId });
    }
   
    const id = setInterval(async () => {
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
              await axios.post('http://localhost:5000/api/location', data);
              socket.emit('new-location-log', data);
              setLocationData(position.coords);
              console.log('Location sent to backend', position.coords);
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
    }, 4000);

    setTimeout(() => {
      clearInterval(id);
      setIsTracking(false);
      socket.emit('user-offline', { userId });
    }, 60000);
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
        //   disabled={isTracking}
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
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Home;
