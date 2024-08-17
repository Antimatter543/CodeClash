import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Combat from './pages/combatScreen'
import Navbar from './customComponents/Navbar'
import SetupScreen from './pages/SetupScreen';

export default function App() {
  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='overflow-hidden h-full'>
          <Routes>
            <Route path="/" element={<SetupScreen/>} />
            <Route path="/battle" element={<Combat/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

