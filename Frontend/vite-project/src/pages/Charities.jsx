import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart } from 'lucide-react';

export default function Charities() {
  const { user } = useContext(AuthContext);
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/charity', { withCredentials: true });
      setCharities(res.data);
    } catch (err) { }
  };

  const selectCharity = async (charityId) => {
    // In a real app we'd have a route to update user's selected charity
    alert('Thank you! This charity is now selected for your contributions.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Heart className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-dark tracking-tight mb-4">Our Charity Partners</h1>
        <p className="text-xl text-gray-600">
          A percentage of every subscription goes directly to the charity you choose. Play good golf, do good deeds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map(c => (
          <div key={c._id} className="glass rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-accent/40 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">{c.name.charAt(0)}</span>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-3">{c.name}</h3>
            <p className="text-gray-600 mb-6 min-h-[4rem]">{c.description}</p>
            
            <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-6">
              <span className="text-sm font-semibold text-gray-500">
                Raised: <span className="text-green-600">${c.totalContributions}</span>
              </span>
              {user && (
                <button 
                  onClick={() => selectCharity(c._id)}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Select
                </button>
              )}
            </div>
          </div>
        ))}
        {charities.length === 0 && (
          <div className="col-span-full text-center text-gray-500 bg-gray-50 py-10 rounded-3xl border border-gray-200">
            No charities listed yet. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
}
