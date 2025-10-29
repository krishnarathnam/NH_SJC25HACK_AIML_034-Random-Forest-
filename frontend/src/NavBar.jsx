import _React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { getCurrentUser, logout, authenticatedFetch } from './utils/auth.js';
import UserDashboard from './components/UserDashboard.jsx';

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const user = getCurrentUser();
  
  // State for total XP across all sessions
  const [xpData, setXpData] = useState({
    xpLevel: 1,
    currentLevelXP: 0,
    xpForNextLevel: 100,
    totalXP: 0
  });

  // Fetch user's total XP on mount
  useEffect(() => {
    async function fetchTotalXP() {
      try {
        const res = await authenticatedFetch('http://localhost:3001/api/user/total-xp');
        const data = await res.json();
        setXpData({
          xpLevel: data.xpLevel || 1,
          currentLevelXP: data.currentLevelXP || 0,
          xpForNextLevel: data.xpForNextLevel || 100,
          totalXP: data.totalXP || 0
        });
      } catch (error) {
        console.error('Failed to fetch total XP:', error);
      }
    }
    
    if (user) {
      fetchTotalXP();
      // Refresh total XP every 5 seconds to stay updated
      const interval = setInterval(fetchTotalXP, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);
  
  // Calculate progress percentage for the current level
  const progressPercent = xpData.xpForNextLevel > 0 ? Math.min(100, (xpData.currentLevelXP / xpData.xpForNextLevel) * 100) : 0;
  
  const handleLogout = () => {
    setProfileDropdown(false);
    logout();
  };

  const handleNav = () => {
    setNav(!nav)
  }

  const navItems = [
    { id: 1, text: "Home", to: "/" },
    { id: 2, text: "About", to: "#about" },
    { id: 3, text: "Learn", to: "/learn" },
    { id: 4, text: "Leaderboard", to: "/leaderboard" },
  ];


  return (
    <>

      <div className="h-16 bg-gray-50 border-b border-gray-200 flex items-center">
        <div className="w-full px-4 md:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="md:hidden p-2 rounded hover:bg-gray-100 active:bg-gray-200"
              onClick={handleNav}
            >
              {nav ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
            <span className="text-2xl md:text-3xl text-[#023047] font-bold select-none text-shadow-lg font-pixel-large">SORTIT</span>
            <img src="/logo_image.png" alt="SortIt" className="w-10 h-10" />

          </div>

          <ul className="hidden md:flex items-center gap-6 text-m text-gray-700">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.to.startsWith('#') ? (
                  <a href={item.to} className="hover:text-black hover:underline underline-offset-4">{item.text}</a>
                ) : (
                  <Link to={item.to} className="hover:text-black hover:underline underline-offset-4">{item.text}</Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-md bg-white/90 border border-gray-300">
              <span className="level-text text-xs">LVL {xpData.xpLevel}</span>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#8B5CF6] transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="xp-text text-xs">{xpData.totalXP} XP</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="hidden md:inline text-sm text-gray-700">{user?.name || user?.email}</span>
                <FaUserCircle className="h-7 w-7 text-gray-800" />
              </button>
              
              {profileDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setProfileDropdown(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setProfileDropdown(false);
                          setDashboardOpen(true);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#8B5CF6] hover:bg-purple-50 rounded-md transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      
      {nav && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40"
          onClick={handleNav}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-[#023047] [-webkit-text-stroke:1px_white]">SortIt</span>
              <button
                aria-label="Close menu"
                className="p-2 rounded hover:bg-gray-100 active:bg-gray-200"
                onClick={handleNav}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-col gap-4 text-gray-800">
              {navItems.map((item) => (
                <li key={item.id} onClick={handleNav}>
                  {item.to.startsWith('#') ? (
                    <a href={item.to} className="block px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200">{item.text}</a>
                  ) : (
                    <Link to={item.to} className="block px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200">{item.text}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* User Dashboard Modal */}
      <UserDashboard 
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />
    </>
  )
}

export default NavBar;

