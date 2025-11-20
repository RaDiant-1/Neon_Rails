
import { Station, StationType } from './types';

export const INITIAL_CREDITS = 1000;
export const INITIAL_REPUTATION = 50;
export const MAX_ENERGY = 100;
export const TICK_RATE_MS = 2000; // Game tick every 2 seconds
export const BUILD_COST_BASE = 500;
export const UPGRADE_COST_BASE = 200;
export const STORAGE_KEY = 'neon-rails-save-v1';
export const TUTORIAL_KEY = 'neon-rails-tutorial-v2';

// Placeholder images for visual flavor
export const IMG_CYBER_CITY = "https://picsum.photos/800/400";

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'st-0',
    name: 'Sector 7 Slums',
    description: 'A densely populated residential zone known for its neon markets and unauthorized cyber-clinics.',
    type: StationType.RESIDENTIAL,
    level: 1,
    passengers: 120,
    revenuePerTick: 5,
    coordinates: { x: 10, y: 50 },
    status: 'active'
  },
  {
    id: 'st-1',
    name: 'Core Plaza',
    description: 'The commercial heart of the under-city. Corporate HQs tower above the smog layer.',
    type: StationType.COMMERCIAL,
    level: 1,
    passengers: 80,
    revenuePerTick: 8,
    coordinates: { x: 50, y: 20 },
    status: 'active'
  }
];
