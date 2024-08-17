import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SetupScreen from './pages/SetupScreen';

export default function App() {
  return (
    <Router>
        
        <div className='flex flex-col overflow-hidden h-screen'>
          <Routes>
            <Route path="/" />
            <Route path="/battle" element={<SetupScreen/>} />
          </Routes>
        </div>
    </Router>
  );
}

