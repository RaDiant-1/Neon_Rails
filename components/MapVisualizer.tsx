import React from 'react';
import { Station } from '../types';

interface MapVisualizerProps {
  stations: Station[];
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ stations }) => {
  // A simplified SVG visualization. 
  // We map the stations based on their 'coordinates' (0-100 scale).
  
  return (
    <div className="w-full h-64 md:h-96 bg-black rounded-xl border border-neon-blue/20 relative overflow-hidden shadow-inner group">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
           }}>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connections (Simplified: Connect sequential stations) */}
        {stations.map((station, index) => {
          if (index === stations.length - 1) return null;
          const next = stations[index + 1];
          return (
            <line
              key={`link-${station.id}-${next.id}`}
              x1={`${station.coordinates.x}%`}
              y1={`${station.coordinates.y}%`}
              x2={`${next.coordinates.x}%`}
              y2={`${next.coordinates.y}%`}
              stroke="#bc13fe"
              strokeWidth="3"
              className="opacity-60 animate-pulse"
            />
          );
        })}
        
        {/* Moving "Train" dots along lines - Pure visual fluff */}
         {stations.map((station, index) => {
          if (index === stations.length - 1) return null;
          const next = stations[index + 1];
          return (
            <circle key={`train-${index}`} r="3" fill="#fff">
              <animateMotion 
                dur={`${3 + index}s`} 
                repeatCount="indefinite"
                path={`M${station.coordinates.x * 10} ${station.coordinates.y * 3} L${next.coordinates.x * 10} ${next.coordinates.y * 3}`} // Approximate scaling for SVG coordinate space if viewBox wasn't percentage based.
                // Using percentage in line but calc in animateMotion is tricky in React without viewBox.
                // Fallback to CSS animation for "trains" or simplified approach:
              />
            </circle>
          )
        })}
      </svg>

      {/* Nodes */}
      {stations.map((station) => (
        <div
          key={station.id}
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-black border-2 border-neon-blue hover:scale-150 transition-transform cursor-help z-10 shadow-[0_0_10px_#00f3ff]"
          style={{ left: `${station.coordinates.x}%`, top: `${station.coordinates.y}%` }}
          title={`${station.name} (Lvl ${station.level})`}
        >
            <div className="absolute -inset-2 bg-neon-blue/30 rounded-full animate-ping opacity-75"></div>
        </div>
      ))}
      
      <div className="absolute bottom-2 right-2 text-xs text-neon-blue font-mono bg-black/50 px-2 rounded">
        LIVE NETWORK FEED
      </div>
    </div>
  );
};

export default MapVisualizer;