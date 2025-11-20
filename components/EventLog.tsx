import React, { useEffect, useRef } from 'react';
import { GameEvent } from '../types';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface EventLogProps {
  events: GameEvent[];
}

const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle size={14} className="text-green-400" />;
      case 'negative': return <AlertTriangle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="bg-neon-panel/90 border border-gray-700 rounded-xl p-4 flex flex-col h-full max-h-[400px]">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 font-mono tracking-wider">
        <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
        SYSTEM_LOGS
      </h2>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {events.length === 0 && (
          <div className="text-gray-600 text-sm font-mono italic text-center mt-10">
            No data detected...
          </div>
        )}
        
        {events.map((event) => (
          <div key={event.id} className="bg-black/40 p-3 rounded border-l-2 border-gray-600 hover:bg-black/60 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="flex items-center gap-2 font-bold text-gray-200 text-sm">
                {getIcon(event.impact)}
                {event.title}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">T-{event.timestamp}</span>
            </div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;