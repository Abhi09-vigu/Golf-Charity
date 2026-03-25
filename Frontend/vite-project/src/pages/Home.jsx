import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Award, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-32">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-accent/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white shadow-sm border border-primary-100 text-primary-600 font-medium text-sm mb-6 animate-pulse">
            ✨ Launching the modern way to golf
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark mb-6">
            Play. Win. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">Give Back.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
            Join the premium golf community where every swing counts. Track your scores, win amazing monthly draws, and support charities you love.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl shadow-primary-500/30 flex items-center gap-2 group">
              Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-accent/40 text-primary-600 flex items-center justify-center mb-6 shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark">Track Scores</h3>
            <p className="text-gray-600 leading-relaxed">Enter your golf scores easily. Only your last 5 scores are kept to maximize your winning potential.</p>
          </div>
          <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-accent/40 text-primary-600 flex items-center justify-center mb-6 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark">Win Draws</h3>
            <p className="text-gray-600 leading-relaxed">Match 3, 4, or 5 numbers in our monthly draw to win huge cash prizes from the combined pool.</p>
          </div>
          <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Heart className="w-40 h-40" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent/40 text-primary-600 flex items-center justify-center mb-6 shadow-inner relative z-10">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark relative z-10">Support Charities</h3>
            <p className="text-gray-600 leading-relaxed relative z-10">A portion of every subscription goes to a charity of your choice. Play good, do good.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
