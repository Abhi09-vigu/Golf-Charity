import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', formData);
      
      // Strict Admin Enforcement
      if (res.data.user.role !== 'Admin') {
        alert('Access Denied: Authorized Admin Personnel Only.');
        // If they managed to get a cookie as a user, instantly wipe it
        await api.post('/api/auth/logout');
        return;
      }

      login(res.data.user);
      navigate('/admin');

    } catch (err) {
      alert(err.response?.data?.message || 'Invalid Admin Credentials');
    }
  };

  return (
    <div className="bg-dark flex flex-col justify-center py-20 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldCheck className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Restricted Area
        </h2>
        <p className="text-center text-gray-400 mt-2 font-medium text-sm">
          System Administration Login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 border border-gray-800 py-8 px-4 sm:rounded-3xl sm:px-10 shadow-2xl relative overflow-hidden">
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Admin Email</label>
              <div className="mt-1">
                <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 sm:text-sm transition-all" placeholder="admin@golfcharity.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <div className="mt-1 relative">
                <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, password: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 sm:text-sm transition-all pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-red-400 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-3.5 border border-transparent rounded-xl shadow-lg shadow-red-500/30 text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors duration-200">
                Authenticate
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
