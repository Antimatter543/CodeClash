import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Combat from './pages/combatScreen'
import Navbar from './customComponents/Navbar'

export default function App() {
  return ( 
    <div className='h-screen overflow-hidden'>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Combat/> } />            
          </Routes>
        </Router>
    </div>
  );
}

