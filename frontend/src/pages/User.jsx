import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import Slide from '@mui/material/Slide';
// import './App.css';


const socket = io('http://localhost:5000');
function User() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', credentials);
      if(response.data.message === "Please enter the Credentials"){
        triggerSnackbar('hola', 'error')
        alert(response.data.message);
      }
      triggerSnackbar('Registered successfully!', 'success');
    } catch (error) {
      if(error.response.data.message){
        triggerSnackbar(error.response.data.message, 'error');
      }
      // console.error('Error registering user:', error.response?.data);
      // triggerSnackbar('Failed to register', 'error');
      // alert(error.response?.data?.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      setUser(response.data.user);
      triggerSnackbar('Logged in successfully!', 'success');
    } catch (error) {
      console.error('Error logging in:', error.response?.data);
      alert(error.response?.data?.message);
    }
  };

  const startTracking = () => {
    setIsTracking(true);

    const id = setInterval(async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await axios.post('http://localhost:5000/api/location', {
                userId: user._id,
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              });

              socket.emit('new-location-log', { 
                userId: user._id,
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
               });
              setLocation(position.coords);
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
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }, 4000);

    setTimeout(() => {
      clearInterval(id);
      setIsTracking(false);
    }, 60000);
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Example function to show snackbar on specific actions
  const triggerSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  return (
    <Box >
      <div className=' h-[100vh] min-w-80 flex justify-center bg-[#f5f4f4] items-center'>

      {!user ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Register or Login
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
              Register
            </Button>
            <Button variant="outlined" color="primary" onClick={handleLogin} fullWidth>
              Login
            </Button>
            <Divider>OR</Divider>
            <Button variant="text" color="secondary" onClick={() => navigate('/admin')}>
              Login as Admin
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.username}
          </Typography>
          <Button
            variant="contained"
            color={isTracking ? 'secondary' : 'primary'}
            onClick={startTracking}
            disabled={isTracking}
            fullWidth
          >
            {isTracking ? 'Tracking...' : 'Start Tracking'}
          </Button>
          {location && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <Typography variant="body2">
                Current Time: {new Date(location.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </Typography>
              <Typography variant="body2">Latitude: {location.latitude}</Typography>
              <Typography variant="body2">Longitude: {location.longitude}</Typography>
              <Typography variant="body2">Accuracy: {location.accuracy || 'N/A'}</Typography>
              <Typography variant="body2">Altitude: {location.altitude || 'N/A'}</Typography>
              <Typography variant="body2">Speed: {location.speed || 'N/A'}</Typography>
            </Box>
          )}
        </Paper>
      )}
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default User;
