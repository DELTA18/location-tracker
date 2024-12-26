import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="117150575881-71ouack2cucj7c8fena5n5grv8v9jler.apps.googleusercontent.com"> 
        <App />
    </GoogleOAuthProvider>;
  </StrictMode>,
)
