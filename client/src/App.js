import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Home from './Component/Home'
import Meeting from './Component/Meeting'
import './style.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/meetings/:meetingId' element={<Meeting />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
