import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import User from './pages/User';
import Tp from './pages/tp';
import Dashboard from './pages/DashBoard';
import Auth from './pages/Auth';
import Home from './pages/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/tp" element={<Tp />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
