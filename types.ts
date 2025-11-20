export enum StationType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  CYBERNETIC = 'CYBERNETIC'
}

export interface Station {
  id: string;
  name: string;
  description: string;
  type: StationType;
  level: number;
  passengers: number;
  revenuePerTick: number;
  coordinates: { x: number; y: number }; // For visualizer relative positioning
  status: 'active' | 'locked' | 'disrupted';
}

export interface GameEvent {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface GameState {
  credits: number;
  reputation: number; // 0-100
  energy: number; // 0-100
  stations: Station[];
  events: GameEvent[];
  tick: number;
}

export interface AIResponseStation {
  name: string;
  description: string;
  type: string;
}

export interface AIResponseEvent {
  title: string;
  description: string;
  impactType: string; // positive, negative, neutral
  creditChange: number;
}