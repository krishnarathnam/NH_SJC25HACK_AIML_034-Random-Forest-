import { useState } from 'react';
import NavBar from "./NavBar.jsx"
import HomePage from "./HomePage.jsx"
import Learn from "./Learn.jsx"
import LearningPage from "./LearningPage.jsx"
import Leaderboard from "./Leaderboard.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  // Global XP state for navbar
  const [xpData, setXpData] = useState({
    xpLevel: 1,
    currentLevelXP: 0,
    xpForNextLevel: 100,
    totalXP: 0
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes with navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <NavBar 
              xpLevel={xpData.xpLevel}
              currentLevelXP={xpData.currentLevelXP}
              xpForNextLevel={xpData.xpForNextLevel}
              totalXP={xpData.totalXP}
            />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/learning/:algorithm" element={<LearningPage setXpData={setXpData} />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
