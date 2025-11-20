import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, Station, StationType, GameEvent 
} from './types';
import { 
  INITIAL_CREDITS, INITIAL_REPUTATION, INITIAL_STATIONS, 
  TICK_RATE_MS, BUILD_COST_BASE, UPGRADE_COST_BASE 
} from './constants';
import { generateStationDetails, generateRandomGameEvent } from './services/geminiService';

import Header from './components/Header';
import StationCard from './components/StationCard';
import MapVisualizer from './components/MapVisualizer';
import EventLog from './components/EventLog';
import { PlusCircle, Play, Pause, RefreshCw } from 'lucide-react';

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    credits: INITIAL_CREDITS,
    reputation: INITIAL_REPUTATION,
    energy: 100,
    stations: INITIAL_STATIONS,
    events: [],
    tick: 0
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setGameState(prev => {
          // Calculate Income
          const income = prev.stations.reduce((acc, s) => acc + (s.status === 'active' ? s.revenuePerTick : 0), 0);
          
          // Energy decay based on station count
          const energyUse = prev.stations.length * 0.5;
          const newEnergy = Math.max(0, prev.energy - energyUse + (prev.energy < 100 ? 2 : 0)); // Base regeneration

          return {
            ...prev,
            credits: prev.credits + income,
            energy: newEnergy,
            tick: prev.tick + 1
          };
        });
      }, TICK_RATE_MS);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Random Event Generator Trigger
  useEffect(() => {
    if (!isPlaying) return;
    
    // 10% chance every tick to trigger an event
    if (Math.random() < 0.1) {
        triggerRandomEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.tick]);

  const triggerRandomEvent = async () => {
      // Prevent overlapping generations
      if (isGenerating) return; 
      
      // Simple client-side lock, technically not thread-safe but fine for React state here
      const currentRep = gameState.reputation;
      
      try {
          const aiEvent = await generateRandomGameEvent(currentRep);
          const newEvent: GameEvent = {
              id: `evt-${Date.now()}`,
              timestamp: gameState.tick,
              title: aiEvent.title,
              description: aiEvent.description,
              impact: aiEvent.impactType as 'positive' | 'negative' | 'neutral'
          };

          setGameState(prev => ({
              ...prev,
              credits: prev.credits + aiEvent.creditChange,
              reputation: Math.min(100, Math.max(0, prev.reputation + (aiEvent.impactType === 'positive' ? 5 : aiEvent.impactType === 'negative' ? -5 : 0))),
              events: [newEvent, ...prev.events]
          }));
      } catch (e) {
          console.error("Event gen failed", e);
      }
  };

  const handleBuildStation = async () => {
    if (gameState.credits < BUILD_COST_BASE) return;
    setIsGenerating(true);

    // Deduct cost immediately
    setGameState(prev => ({ ...prev, credits: prev.credits - BUILD_COST_BASE }));

    try {
      const details = await generateStationDetails();
      
      const newStation: Station = {
        id: `st-${Date.now()}`,
        name: details.name,
        description: details.description,
        type: details.type as StationType || StationType.RESIDENTIAL,
        level: 1,
        passengers: 50,
        revenuePerTick: 5,
        // Random coordinates for visualization
        coordinates: { x: Math.floor(Math.random() * 90), y: Math.floor(Math.random() * 80) + 10 },
        status: 'active'
      };

      setGameState(prev => ({
        ...prev,
        stations: [...prev.stations, newStation],
        events: [{
            id: `build-${Date.now()}`,
            timestamp: prev.tick,
            title: "New Sector Opened",
            description: `Construction complete at ${newStation.name}.`,
            impact: 'positive'
        }, ...prev.events]
      }));

    } catch (error) {
      console.error("Failed to build station", error);
      // Refund on failure
      setGameState(prev => ({ ...prev, credits: prev.credits + BUILD_COST_BASE }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgradeStation = (id: string) => {
    const station = gameState.stations.find(s => s.id === id);
    if (!station) return;

    const cost = UPGRADE_COST_BASE * station.level;
    if (gameState.credits < cost) return;

    setGameState(prev => ({
      ...prev,
      credits: prev.credits - cost,
      stations: prev.stations.map(s => {
        if (s.id === id) {
          return {
            ...s,
            level: s.level + 1,
            revenuePerTick: Math.floor(s.revenuePerTick * 1.5),
            passengers: Math.floor(s.passengers * 1.2)
          };
        }
        return s;
      })
    }));
  };

  return (
    <div className="min-h-screen pb-12">
      <Header 
        credits={gameState.credits}
        reputation={gameState.reputation}
        energy={gameState.energy}
        tick={gameState.tick}
      />

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Map & Controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Map Section */}
          <section>
            <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-bold text-white font-mono">NETWORK_MAP</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-2 rounded-full ${isPlaying ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'} hover:bg-opacity-50 transition`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                </div>
            </div>
            <MapVisualizer stations={gameState.stations} />
          </section>

          {/* Build Control */}
          <div className="bg-gradient-to-r from-neon-panel to-black p-6 rounded-xl border border-neon-blue/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
            <div>
                <h3 className="text-lg font-bold text-white">Expand Network</h3>
                <p className="text-sm text-gray-400">Connect a new sector to the grid.</p>
            </div>
            <button
              onClick={handleBuildStation}
              disabled={isGenerating || gameState.credits < BUILD_COST_BASE}
              className={`
                px-6 py-3 rounded font-bold flex items-center gap-2 transition-all transform active:scale-95
                ${isGenerating || gameState.credits < BUILD_COST_BASE 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-neon-blue text-black hover:bg-white hover:shadow-[0_0_15px_#00f3ff]'
                }
              `}
            >
              {isGenerating ? (
                <RefreshCw className="animate-spin" /> 
              ) : (
                <PlusCircle />
              )}
              {isGenerating ? 'Fabricating...' : `Construct Station (${BUILD_COST_BASE} CR)`}
            </button>
          </div>

          {/* Stations Grid */}
          <section>
            <h2 className="text-xl font-bold text-white font-mono mb-4">ACTIVE_STATIONS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameState.stations.map(station => (
                <StationCard 
                  key={station.id}
                  station={station}
                  onUpgrade={handleUpgradeStation}
                  upgradeCost={UPGRADE_COST_BASE * station.level}
                  canAfford={gameState.credits >= UPGRADE_COST_BASE * station.level}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Logs & Info */}
        <div className="lg:col-span-4 space-y-6">
           <EventLog events={gameState.events} />
           
           <div className="bg-neon-panel/50 border border-gray-800 p-4 rounded-xl">
               <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase font-mono">System Status</h3>
               <div className="space-y-2 text-xs font-mono text-gray-500">
                   <div className="flex justify-between">
                       <span>Network Load</span>
                       <span className="text-neon-blue">{Math.floor(gameState.stations.length * 12)}%</span>
                   </div>
                   <div className="flex justify-between">
                       <span>Passenger Satisfaction</span>
                       <span className="text-neon-pink">{Math.min(100, 85 + Math.floor(gameState.reputation / 10))}%</span>
                   </div>
                   <div className="flex justify-between">
                       <span>AI Core</span>
                       <span className="text-green-400">ONLINE</span>
                   </div>
               </div>
           </div>
        </div>

      </main>
    </div>
  );
}