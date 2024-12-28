import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card } from '@mui/material';
import axios from 'axios';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
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
        navigate('/admin/dashboard');
        setError('');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };


  return (
    <div className='admin bg-[#f5f4f4] w-full h-screen flex flex-col justify-center items-center'>
      <Card variant='outlined'
       className=' bg-slate-300 p-8 rounded-lg flex flex-col justify-center items-center'
       >
      <h1 className='text-4xl font-bold text-gray-900'>Admin Login</h1>
      <form onSubmit={handleLogin} className=' flex flex-col ' >
        <TextField id="outlined-basic"
           label="Admin Name" 
           variant="outlined" 
           margin="normal" 
           value={username}
           onChange={(e) => setUsername(e.target.value)} />
       <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" className='mt-4'>Login</Button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        
      </Card>
    </div>
  );
}

export default Admin;
