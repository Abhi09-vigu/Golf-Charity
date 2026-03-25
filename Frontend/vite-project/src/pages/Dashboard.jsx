import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Target, Trophy, CreditCard, Heart } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [subStatus, setSubStatus] = useState('Loading...');
  const [newScore, setNewScore] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const scoreRes = await axios.get('http://localhost:5000/api/score', { withCredentials: true });
      setScores(scoreRes.data);
      
      const subRes = await axios.get('http://localhost:5000/api/subscription/status', { withCredentials: true });
      setSubStatus(subRes.data.status);

      const winRes = await axios.get('http://localhost:5000/api/winner/my-winnings', { withCredentials: true });
      setWinnings(winRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!newScore || newScore < 1 || newScore > 45) return alert('Score must be 1-45');
    try {
      const res = await axios.post('http://localhost:5000/api/score', { score: parseInt(newScore) }, { withCredentials: true });
      setScores(res.data);
      setNewScore('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const subscribe = async (plan) => {
    try {
      const res = await axios.post('http://localhost:5000/api/subscription/create-checkout-session', { plan }, { withCredentials: true });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleUploadProof = async (winnerId) => {
    const url = prompt("Enter proof image URL to verify your winnings:");
    if (!url) return;
    try {
      await axios.post(`http://localhost:5000/api/winner/${winnerId}/upload-proof`, { proofUrl: url }, { withCredentials: true });
      fetchData();
      alert("Proof submitted successfully");
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-500 mt-2">Here is what's happening with your Golf Charity profile today.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          {/* Subscription Card */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <CreditCard className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10"><CreditCard className="text-primary-500 w-6 h-6" /> Subscription Status</h3>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${subStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {subStatus}
              </span>
            </div>
            
            {subStatus !== 'Active' && (
              <div className="flex gap-4 relative z-10">
                <button onClick={() => subscribe('Monthly')} className="flex-1 px-4 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                  $10 / Month
                </button>
                <button onClick={() => subscribe('Yearly')} className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary-500/30">
                  $100 / Year
                </button>
              </div>
            )}
          </div>

          {/* Charity Pick */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart className="text-primary-500 w-6 h-6" /> Selected Charity</h3>
            <p className="text-gray-600 mb-4">You have not selected a charity yet. Giving back is at the core of our mission.</p>
            <button className="px-5 py-2.5 bg-accent/30 text-primary-700 font-semibold rounded-xl hover:bg-accent/50 transition-colors">
              Choose Charity
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Scores Card */}
          <div className="glass p-8 rounded-3xl">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="text-primary-500 w-6 h-6" /> Your Latest Scores</h3>
             <form onSubmit={handleAddScore} className="flex gap-3 mb-6">
                <input 
                  type="number" 
                  min="1" max="45" 
                  placeholder="Enter score (1-45)" 
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  required
                />
                <button type="submit" className="px-6 py-3 bg-dark text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md">
                  Add
                </button>
             </form>
             
             <div className="space-y-3">
               {scores.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No scores yet. Start playing!</p>
               ) : (
                 scores.map((s, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                     <span className="text-gray-500 text-sm">{new Date(s.date).toLocaleDateString()}</span>
                     <span className="font-extrabold text-xl text-primary-600 bg-primary-50 px-4 py-1.5 rounded-lg">{s.value}</span>
                   </div>
                 ))
               )}
             </div>
             {scores.length > 0 && (
               <p className="text-xs text-gray-400 mt-4 text-center">Only your last 5 scores are kept for the draws.</p>
             )}
          </div>

          {/* Draw Card */}
          <div className="glass p-8 rounded-3xl bg-gradient-to-br from-white to-accent/10">
             <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Trophy className="text-yellow-500 w-6 h-6" /> Next Month Draw</h3>
             <p className="text-gray-600 text-sm mb-4">Complete your 5 scores to enter. Winners are drawn automatically.</p>
             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 h-2.5 rounded-full" style={{ width: `${(scores.length / 5) * 100}%` }}></div>
             </div>
             <p className="text-xs text-right text-gray-500 font-medium">{scores.length}/5 Scores</p>
          </div>
        </div>
      </div>

      {/* Winnings Section */}
      {winnings.length > 0 && (
        <div className="mt-8 glass p-8 rounded-3xl border-2 border-yellow-400/50">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="text-yellow-500 w-8 h-8" /> Your Winnings</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winnings.map(w => (
              <div key={w._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-dark mb-1">Prize: ${w.prizeAmount.toFixed(2)}</h4>
                  <p className="text-gray-500 text-sm mb-3">Matches: {w.matches} numbers</p>
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded w-max">Verification: {w.verificationStatus}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded w-max">Payment: {w.paymentStatus}</span>
                  </div>
                </div>
                {w.verificationStatus === 'Pending' && !w.proofUrl && (
                  <button onClick={() => handleUploadProof(w._id)} className="w-full py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-md">
                    Upload Proof
                  </button>
                )}
                {w.proofUrl && (
                  <span className="text-sm font-semibold text-green-600 text-center border-t border-gray-100 pt-3">Proof Submitted</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
