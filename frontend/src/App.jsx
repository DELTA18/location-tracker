import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import User from './pages/User';
import Tp from './pages/tp';
import Dashboard from './pages/DashBoard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/tp" element={<Tp />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
