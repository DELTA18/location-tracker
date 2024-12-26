import { useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', credentials);
      alert(response.data.message);
    } catch (error) {
      console.error('Error registering user:', error.response?.data);
      alert(error.response?.data?.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      setUser(response.data.user);
      alert('Login successful');
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
              setLocation(position.coords);
              console.log('Location sent to backend', position.coords);
            } catch (error) {
              console.error('Error sending location:', error);
            }
          },
          (error) => console.error('Error getting location:', error)
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

  return (
    <div>
      {!user ? (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.username}</h2>
          <button onClick={startTracking} disabled={isTracking}>
            {isTracking ? 'Tracking...' : 'Start Tracking'}
          </button>
          {location && (
            <div>
              <h3>Current Location</h3>
              <p>Cutrrent time: {
                Date.now().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>Timestamp: {location.timestamp}</p>
              <p>Accuracy: {location.accuracy}</p>
              <p>Altitude: {location.altitude}</p>
              <p>Speed: {location.speed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
