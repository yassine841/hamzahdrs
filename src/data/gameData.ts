import { Formation, GameConfig, PlayerPosition } from '../types';

// Player names database
export const PLAYER_NAMES = {
  first: [
    'Alex', 'Ben', 'Chris', 'David', 'Ethan', 'Felix', 'Gabriel', 'Henry',
    'Ivan', 'Jack', 'Kevin', 'Leo', 'Marcus', 'Nathan', 'Oscar', 'Paul',
    'Quinn', 'Ryan', 'Sam', 'Tom', 'Ulrich', 'Victor', 'Will', 'Xavier',
    'Yann', 'Zack', 'Adrian', 'Blake', 'Carlos', 'Diego', 'Eduardo', 'Franco',
    'Giovanni', 'Hugo', 'Isaac', 'Jorge', 'Kai', 'Luis', 'Mario', 'Nicolas',
    'Oliver', 'Pedro', 'Rafael', 'Sebastian', 'Tomas', 'Valentino', 'Walter'
  ],
  last: [
    'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fisher', 'Garcia', 'Harris',
    'Johnson', 'King', 'Lewis', 'Martinez', 'Nelson', 'O\'Connor', 'Parker',
    'Rodriguez', 'Smith', 'Taylor', 'Williams', 'Young', 'Zhang', 'Ahmed',
    'Becker', 'Costa', 'Dubois', 'Eriksson', 'Fernandez', 'Gonzalez', 'Hansen',
    'Ivanov', 'Jensen', 'Kumar', 'Lopez', 'Mueller', 'Nielsen', 'Olsen',
    'Petrov', 'Rossi', 'Silva', 'Thompson', 'Volkov', 'Wagner', 'Yamamoto'
  ]
};

// Countries for player nationalities
export const COUNTRIES = [
  'Argentina', 'Brazil', 'England', 'France', 'Germany', 'Italy', 'Spain',
  'Netherlands', 'Portugal', 'Belgium', 'Croatia', 'Denmark', 'Sweden',
  'Norway', 'Poland', 'Czech Republic', 'Mexico', 'Colombia', 'Uruguay',
  'Chile', 'Japan', 'South Korea', 'Australia', 'USA', 'Canada'
];

// Available formations
export const FORMATIONS: Formation[] = [
  {
    id: '4-4-2',
    name: '4-4-2',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'LB', x: 20, y: 20 },
      { position: 'CB', x: 40, y: 15 },
      { position: 'CB', x: 60, y: 15 },
      { position: 'RB', x: 80, y: 20 },
      { position: 'LM', x: 20, y: 45 },
      { position: 'CM', x: 40, y: 50 },
      { position: 'CM', x: 60, y: 50 },
      { position: 'RM', x: 80, y: 45 },
      { position: 'ST', x: 35, y: 80 },
      { position: 'ST', x: 65, y: 80 }
    ]
  },
  {
    id: '4-3-3',
    name: '4-3-3',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'LB', x: 20, y: 20 },
      { position: 'CB', x: 40, y: 15 },
      { position: 'CB', x: 60, y: 15 },
      { position: 'RB', x: 80, y: 20 },
      { position: 'CDM', x: 50, y: 35 },
      { position: 'CM', x: 35, y: 50 },
      { position: 'CM', x: 65, y: 50 },
      { position: 'LW', x: 20, y: 75 },
      { position: 'ST', x: 50, y: 85 },
      { position: 'RW', x: 80, y: 75 }
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'CB', x: 30, y: 20 },
      { position: 'CB', x: 50, y: 15 },
      { position: 'CB', x: 70, y: 20 },
      { position: 'LM', x: 15, y: 45 },
      { position: 'CM', x: 35, y: 50 },
      { position: 'CM', x: 50, y: 45 },
      { position: 'CM', x: 65, y: 50 },
      { position: 'RM', x: 85, y: 45 },
      { position: 'ST', x: 40, y: 80 },
      { position: 'ST', x: 60, y: 80 }
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'LB', x: 20, y: 20 },
      { position: 'CB', x: 40, y: 15 },
      { position: 'CB', x: 60, y: 15 },
      { position: 'RB', x: 80, y: 20 },
      { position: 'CDM', x: 40, y: 40 },
      { position: 'CDM', x: 60, y: 40 },
      { position: 'LW', x: 25, y: 65 },
      { position: 'CAM', x: 50, y: 60 },
      { position: 'RW', x: 75, y: 65 },
      { position: 'ST', x: 50, y: 85 }
    ]
  }
];

// Game configuration
export const GAME_CONFIG: GameConfig = {
  playerStatRange: {
    min: 36,
    max: 39
  },
  energyRefillRate: 10, // 10 minutes per energy point
  maxEnergy: 100,
  trainingCosts: {
    energy: 10,
    coins: 50
  },
  adBoostMultiplier: 2,
  tournamentSchedule: {
    frequency: 'weekly',
    teams: 22
  }
};

// Position requirements for formations
export const POSITION_REQUIREMENTS: Record<PlayerPosition, number> = {
  'GK': 1,
  'CB': 2,
  'LB': 1,
  'RB': 1,
  'CDM': 0,
  'CM': 2,
  'CAM': 0,
  'LM': 0,
  'RM': 0,
  'LW': 1,
  'RW': 1,
  'ST': 2,
  'CF': 0
};

// Stadium upgrade data
export const STADIUM_UPGRADES = [
  { level: 1, capacity: 5000, upgradeCost: 0 },
  { level: 2, capacity: 8000, upgradeCost: 10000 },
  { level: 3, capacity: 12000, upgradeCost: 25000 },
  { level: 4, capacity: 18000, upgradeCost: 50000 },
  { level: 5, capacity: 25000, upgradeCost: 100000 },
  { level: 6, capacity: 35000, upgradeCost: 200000 },
  { level: 7, capacity: 50000, upgradeCost: 500000 }
];

// Tournament prizes
export const TOURNAMENT_PRIZES = {
  winner: 5000,
  runnerUp: 2500,
  semifinalist: 1000
};

// Coach data
export const AVAILABLE_COACHES = [
  {
    id: 'coach-1',
    name: 'Roberto Martinez',
    specialty: 'all' as PlayerPosition | 'all',
    trainingBonus: 0.15,
    cost: 25000,
    hired: false
  },
  {
    id: 'coach-2',
    name: 'Giuseppe Rossi',
    specialty: 'ST' as PlayerPosition,
    trainingBonus: 0.25,
    cost: 15000,
    hired: false
  },
  {
    id: 'coach-3',
    name: 'Hans Mueller',
    specialty: 'CB' as PlayerPosition,
    trainingBonus: 0.25,
    cost: 15000,
    hired: false
  },
  {
    id: 'coach-4',
    name: 'Jean Dubois',
    specialty: 'CM' as PlayerPosition,
    trainingBonus: 0.25,
    cost: 15000,
    hired: false
  }
];