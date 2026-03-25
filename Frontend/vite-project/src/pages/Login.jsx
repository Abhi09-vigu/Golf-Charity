import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload, { withCredentials: true });
      login(res.data.user);
      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-dark tracking-tight">
          {isLogin ? 'Sign in to' : 'Join'} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
            Golf Charity
          </span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass py-8 px-4 sm:rounded-3xl sm:px-10 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-accent/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input type="text" required onChange={(e) => setFormData({...formData, name: e.target.value})} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm transition-all" placeholder="John Doe" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email address</label>
              <div className="mt-1">
                <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm transition-all" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="mt-1">
                <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm transition-all" placeholder="••••••••" />
              </div>
            </div>



            <div>
              <button type="submit" className="w-full flex justify-center py-3.5 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:scale-[1.02] transition-transform duration-200">
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center relative z-10 border-t border-gray-100 pt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors">
              {isLogin ? "New to Golf Charity? " : "Already have an account? "}
              <span className="text-primary-600 hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
