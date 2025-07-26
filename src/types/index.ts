// Player and Team Types
export interface PlayerStats {
  stamina: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  stats: PlayerStats;
  age: number;
  nationality: string;
  value: number;
  isInjured: boolean;
  trainingProgress: number;
  energy: number;
}

export type PlayerPosition = 
  | 'GK' // Goalkeeper
  | 'CB' // Center Back
  | 'LB' // Left Back
  | 'RB' // Right Back
  | 'CDM' // Central Defensive Midfielder
  | 'CM' // Central Midfielder
  | 'CAM' // Central Attacking Midfielder
  | 'LM' // Left Midfielder
  | 'RM' // Right Midfielder
  | 'LW' // Left Winger
  | 'RW' // Right Winger
  | 'ST' // Striker
  | 'CF'; // Center Forward

export interface Formation {
  id: string;
  name: string;
  positions: {
    position: PlayerPosition;
    x: number;
    y: number;
  }[];
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  players: Player[];
  formation: Formation;
  stadium: Stadium;
  coins: number;
  trophies: number;
  wins: number;
  draws: number;
  losses: number;
  createdAt: Date;
}

export interface Stadium {
  id: string;
  name: string;
  capacity: number;
  level: number;
  upgradeCost: number;
}

// Match and Tournament Types
export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury';
  playerId: string;
  teamId: string;
  description: string;
}

export interface MatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  events: MatchEvent[];
  homeStats: MatchStats;
  awayStats: MatchStats;
  scheduledAt: Date;
  finishedAt?: Date;
  round: number;
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  status: 'upcoming' | 'active' | 'finished';
  currentRound: number;
  totalRounds: number;
  prize: {
    winner: number;
    runnerUp: number;
    semifinalist: number;
  };
  startDate: Date;
  endDate: Date;
}

// User and Game State Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  teamId: string;
  coins: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefill: Date;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
}

export interface GameState {
  user: User | null;
  team: Team | null;
  currentTournament: Tournament | null;
  isLoading: boolean;
  error: string | null;
}

// Training and Economy Types
export interface TrainingSession {
  id: string;
  playerId: string;
  type: 'stamina' | 'attack' | 'defense' | 'speed';
  duration: number; // in minutes
  energyCost: number;
  coinCost: number;
  startedAt: Date;
  completedAt?: Date;
  boostedWithAd: boolean;
}

export interface Coach {
  id: string;
  name: string;
  specialty: PlayerPosition | 'all';
  trainingBonus: number;
  cost: number;
  hired: boolean;
}

// Leaderboard and Social Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  teamName: string;
  managerName: string;
  trophies: number;
  wins: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  reward: number;
  claimed: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Game Configuration
export interface GameConfig {
  playerStatRange: {
    min: number;
    max: number;
  };
  energyRefillRate: number; // minutes per energy point
  maxEnergy: number;
  trainingCosts: {
    energy: number;
    coins: number;
  };
  adBoostMultiplier: number;
  tournamentSchedule: {
    frequency: 'weekly' | 'daily';
    teams: number;
  };
}