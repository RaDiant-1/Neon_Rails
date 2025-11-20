import React, { useState } from 'react';
import { Station, StationType } from '../types';
import { ArrowUpCircle, Users, DollarSign, MessageSquare } from 'lucide-react';
import { chatWithPassenger } from '../services/geminiService';

interface StationCardProps {
  station: Station;
  onUpgrade: (id: string) => void;
  upgradeCost: number;
  canAfford: boolean;
}

const StationCard: React.FC<StationCardProps> = ({ station, onUpgrade, upgradeCost, canAfford }) => {
  const [isChatting, setIsChatting] = useState(false);
  const [chatLog, setChatLog] = useState<{user: string, msg: string}[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const getTypeColor = (type: StationType) => {
    switch (type) {
      case StationType.RESIDENTIAL: return 'border-green-500/50 text-green-400';
      case StationType.COMMERCIAL: return 'border-blue-500/50 text-blue-400';
      case StationType.INDUSTRIAL: return 'border-orange-500/50 text-orange-400';
      case StationType.CYBERNETIC: return 'border-purple-500/50 text-purple-400';
      default: return 'border-gray-500';
    }
  };

  const handleSendChat = async () => {
      if(!inputMsg.trim()) return;
      const userMsg = inputMsg;
      setInputMsg("");
      setChatLog(prev => [...prev, { user: 'You', msg: userMsg }]);
      setLoadingChat(true);
      
      const response = await chatWithPassenger(station.name, userMsg);
      
      setChatLog(prev => [...prev, { user: 'Commuter', msg: response }]);
      setLoadingChat(false);
  };

  return (
    <div className={`relative group bg-neon-panel/80 border backdrop-blur-sm p-4 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getTypeColor(station.type)} border-l-4`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white truncate">{station.name}</h3>
        <span className={`text-xs px-2 py-1 rounded bg-black/30 ${getTypeColor(station.type)} border border-current`}>
          LVL {station.level}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden leading-tight">
        {station.description}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Users size={14} />
          <span>{station.passengers.toLocaleString()} / hr</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <DollarSign size={14} />
          <span>{station.revenuePerTick} CR / tick</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onUpgrade(station.id)}
          disabled={!canAfford}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold transition-all
            ${canAfford 
              ? 'bg-neon-blue/20 hover:bg-neon-blue/40 text-neon-blue border border-neon-blue/50' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
            }`}
        >
          <ArrowUpCircle size={16} />
          Upgrade ({upgradeCost})
        </button>
        
        <button 
            onClick={() => setIsChatting(!isChatting)}
            className="p-2 rounded border border-gray-600 hover:bg-gray-700 text-gray-300"
            title="Listen to passengers"
        >
            <MessageSquare size={16} />
        </button>
      </div>

      {/* Mini Chat Overlay */}
      {isChatting && (
          <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-black border border-gray-600 rounded p-3 shadow-xl">
              <div className="h-32 overflow-y-auto mb-2 text-xs space-y-2 scrollbar-thin">
                  {chatLog.length === 0 && <p className="text-gray-500 italic">Eavesdropping on local frequency...</p>}
                  {chatLog.map((c, i) => (
                      <div key={i} className={c.user === 'You' ? 'text-right text-cyan-300' : 'text-left text-pink-300'}>
                          <span className="font-bold block text-[10px] opacity-50">{c.user}</span>
                          {c.msg}
                      </div>
                  ))}
                  {loadingChat && <div className="text-gray-500 animate-pulse">Decrypting...</div>}
              </div>
              <div className="flex gap-1">
                  <input 
                    className="flex-1 bg-gray-900 border border-gray-700 rounded text-xs p-1 text-white outline-none focus:border-cyan-500"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Say something..."
                  />
                  <button onClick={handleSendChat} className="text-xs bg-cyan-900 px-2 rounded text-cyan-200 hover:bg-cyan-800">Send</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default StationCard;