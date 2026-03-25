import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Users, Building2, PlayCircle, Trophy } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [drawResult, setDrawResult] = useState(null);
  
  // Charity form
  const [newCharity, setNewCharity] = useState({ name: '', description: '', logoUrl: '' });

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchUsers();
      fetchCharities();
      fetchWinners();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) { }
  };

  const fetchCharities = async () => {
    try {
      const res = await api.get('/api/charity');
      setCharities(res.data);
    } catch (err) { }
  };

  const fetchWinners = async () => {
    try {
      const res = await api.get('/api/admin/winners');
      setWinners(res.data);
    } catch (err) { }
  };

  const updateWinner = async (id, vStatus, pStatus) => {
    try {
      await api.put(`/api/admin/winners/${id}`, { verificationStatus: vStatus, paymentStatus: pStatus });
      fetchWinners();
    } catch (err) {
      alert('Error updating winner');
    }
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/charity', newCharity);
      setNewCharity({ name: '', description: '', logoUrl: '' });
      fetchCharities();
      alert('Charity added successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const runDraw = async () => {
    try {
      const res = await api.post('/api/admin/draw', {});
      setDrawResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  if (!user) return <Navigate to="/admin-login" />;
  if (user.role !== 'Admin') return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage users, charities, and run monthly draws.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-col md:w-64 gap-3 shrink-0 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`whitespace-nowrap flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Users className="w-5 h-5 shrink-0" /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('charities')} 
            className={`whitespace-nowrap flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'charities' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Building2 className="w-5 h-5 shrink-0" /> Charities
          </button>
          <button 
            onClick={() => setActiveTab('draw')} 
            className={`whitespace-nowrap flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'draw' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Trophy className="w-5 h-5 shrink-0" /> Draw
          </button>
          <button 
            onClick={() => setActiveTab('winners')} 
            className={`whitespace-nowrap flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'winners' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Trophy className="w-5 h-5 shrink-0 text-yellow-500" /> Verify
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'users' && (
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-dark flex items-center gap-2"><Users className="w-6 h-6 text-primary-500" /> Platform Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="py-4 font-semibold text-gray-600">Name</th>
                      <th className="py-4 font-semibold text-gray-600">Email</th>
                      <th className="py-4 font-semibold text-gray-600">Role</th>
                      <th className="py-4 font-semibold text-gray-600">Subscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-medium text-dark">{u.name}</td>
                        <td className="py-4 text-gray-500">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${u.subscriptionStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.subscriptionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'charities' && (
            <div className="space-y-8">
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6 text-dark flex items-center gap-2"><Building2 className="w-6 h-6 text-primary-500" /> Add New Charity</h3>
                <form onSubmit={handleAddCharity} className="space-y-4">
                  <div>
                    <input type="text" placeholder="Charity Name" value={newCharity.name} onChange={e => setNewCharity({...newCharity, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none" required />
                  </div>
                  <div>
                    <textarea placeholder="Description" rows={3} value={newCharity.description} onChange={e => setNewCharity({...newCharity, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none" />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md">Add Charity</button>
                </form>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {charities.map(c => (
                  <div key={c._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg text-dark mb-1">{c.name}</h4>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{c.description}</p>
                    <span className="text-primary-600 font-semibold text-sm">Total Contributions: ${c.totalContributions}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="glass p-8 rounded-3xl text-center py-16">
              <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-dark mb-4">Run Monthly Draw</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Generate winning numbers and distribute prize pools across matched scores (3, 4, or 5 matches).
              </p>
              <button onClick={runDraw} className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-primary-500/30 hover:scale-105 transition-all">
                Run Simulation
              </button>

              {drawResult && (
                <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200 text-left animate-in mb-in-bottom">
                  <h4 className="font-bold text-lg text-dark mb-4">Draw Results:</h4>
                  <div className="flex gap-2 mb-4 justify-center">
                    {drawResult.numbers.map((n, i) => (
                      <span key={i} className="w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-bold text-xl">{n}</span>
                    ))}
                  </div>
                  <p className="text-center font-medium text-green-600 mb-2">Status: {drawResult.status}</p>
                  <p className="text-center text-sm text-gray-600">
                    Winners - 5 matches: {drawResult.results.matches5} | 4 matches: {drawResult.results.matches4} | 3 matches: {drawResult.results.matches3}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'winners' && (
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-dark flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Winner Verifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="py-4 font-semibold text-gray-600">User</th>
                      <th className="py-4 font-semibold text-gray-600">Matches</th>
                      <th className="py-4 font-semibold text-gray-600">Prize</th>
                      <th className="py-4 font-semibold text-gray-600">Proof</th>
                      <th className="py-4 font-semibold text-gray-600">Verification</th>
                      <th className="py-4 font-semibold text-gray-600">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map(w => (
                      <tr key={w._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-medium text-dark">{w.userId?.name}</td>
                        <td className="py-4 font-bold text-primary-600">{w.matches}</td>
                        <td className="py-4 font-medium">${w.prizeAmount.toFixed(2)}</td>
                        <td className="py-4">
                          {w.proofUrl ? <a href={w.proofUrl} target="_blank" className="text-blue-500 hover:underline">View</a> : <span className="text-gray-400">None</span>}
                        </td>
                        <td className="py-4">
                          <select 
                            value={w.verificationStatus} 
                            onChange={(e) => updateWinner(w._id, e.target.value, w.paymentStatus)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4">
                           <select 
                            value={w.paymentStatus} 
                            onChange={(e) => updateWinner(w._id, w.verificationStatus, e.target.value)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
