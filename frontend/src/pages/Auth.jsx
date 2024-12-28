import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

function Auth() {
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const triggerSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', credentials);
      triggerSnackbar('Registered successfully!', 'success');
    } catch (error) {
      triggerSnackbar(error.response?.data?.message || 'Failed to register', 'error');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      const userId = response.data.user._id;
      triggerSnackbar('Logged in successfully!', 'success');
      navigate('/home', { state: { userId } });
    } catch (error) {
      triggerSnackbar(error.response?.data?.message || 'Failed to login', 'error');
    }
  };

  return (
    <Box className="h-[100vh] flex justify-center bg-[#f5f4f4] items-center">
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Auth;
