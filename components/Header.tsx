
import React from 'react';
import { Zap, CreditCard, Activity, Shield, HelpCircle } from 'lucide-react';

interface HeaderProps {
  credits: number;
  reputation: number;
  energy: number;
  tick: number;
  onShowTutorial?: () => void;
}

const Header: React.FC<HeaderProps> = ({ credits, reputation, energy, tick, onShowTutorial }) => {
  return (
    <header className="sticky top-0 z-50 bg-neon-dark/90 backdrop-blur-md border-b border-neon-blue/30 p-4 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-blue rounded-full flex items-center justify-center shadow-[0_0_10px_#00f3ff]">
            <Activity className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-mono">
              Neon<span className="text-neon-blue">Rails</span>
            </h1>
            <span className="text-xs text-gray-400 font-mono">SYS.TICK: {tick}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div id="tutorial-stats" className="hidden md:flex gap-6 text-sm font-mono">
            <div className="flex items-center gap-2 text-neon-blue">
              <CreditCard size={18} />
              <span className="font-bold">{credits.toLocaleString()} CR</span>
            </div>
            
            <div className={`flex items-center gap-2 ${reputation < 30 ? 'text-red-500' : 'text-neon-pink'}`}>
              <Shield size={18} />
              <span className="font-bold">{reputation}% REP</span>
            </div>

            <div className="flex items-center gap-2 text-yellow-400">
              <Zap size={18} />
              <span className="font-bold">{energy}% PWR</span>
            </div>
          </div>
          
          {onShowTutorial && (
            <button 
              onClick={onShowTutorial}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              title="System Manual"
            >
              <HelpCircle size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Stats Bar */}
      <div className="md:hidden flex justify-between mt-4 pt-2 border-t border-gray-800 text-xs font-mono">
         <div className="flex items-center gap-1 text-neon-blue">
           <CreditCard size={14} />
           <span>{credits.toLocaleString()}</span>
         </div>
         <div className={`flex items-center gap-1 ${reputation < 30 ? 'text-red-500' : 'text-neon-pink'}`}>
           <Shield size={14} />
           <span>{reputation}%</span>
         </div>
         <div className="flex items-center gap-1 text-yellow-400">
           <Zap size={14} />
           <span>{energy}%</span>
         </div>
      </div>
    </header>
  );
};

export default Header;
