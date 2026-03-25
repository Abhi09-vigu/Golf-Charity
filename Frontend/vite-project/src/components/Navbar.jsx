import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                Golf Charity
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/charities" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
              Charities
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                    <Crown className="w-5 h-5 text-yellow-500" /> Admin
                  </Link>
                )}
                <div className="h-6 w-px bg-gray-200"></div>
                <button onClick={handleLogout} className="text-gray-600 hover:text-primary-600 flex items-center gap-2 font-medium transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-primary-500/30">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
