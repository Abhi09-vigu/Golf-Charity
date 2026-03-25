import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Crown, Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                Golf Charity
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/charities" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
              <Heart className="w-4 h-4 hidden lg:block" /> Charities
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

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
            <Link to="/charities" onClick={closeMenu} className="block px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50">
              Charities
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                  Dashboard
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" onClick={closeMenu} className="block px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="block px-3 py-3 rounded-xl text-base font-bold text-center text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-md">
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
