import { v4 as uuidv4 } from 'uuid';
import { Player, PlayerPosition, PlayerStats, Team, Match, MatchEvent, MatchStats } from '../types';
import { PLAYER_NAMES, COUNTRIES, GAME_CONFIG, FORMATIONS } from '../data/gameData';

/**
 * Generate a random player with stats between 36-39%
 */
export function generateRandomPlayer(position: PlayerPosition): Player {
  const firstName = PLAYER_NAMES.first[Math.floor(Math.random() * PLAYER_NAMES.first.length)];
  const lastName = PLAYER_NAMES.last[Math.floor(Math.random() * PLAYER_NAMES.last.length)];
  const nationality = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  
  const stats: PlayerStats = {
    stamina: Math.floor(Math.random() * (GAME_CONFIG.playerStatRange.max - GAME_CONFIG.playerStatRange.min + 1)) + GAME_CONFIG.playerStatRange.min,
    attack: Math.floor(Math.random() * (GAME_CONFIG.playerStatRange.max - GAME_CONFIG.playerStatRange.min + 1)) + GAME_CONFIG.playerStatRange.min,
    defense: Math.floor(Math.random() * (GAME_CONFIG.playerStatRange.max - GAME_CONFIG.playerStatRange.min + 1)) + GAME_CONFIG.playerStatRange.min,
    speed: Math.floor(Math.random() * (GAME_CONFIG.playerStatRange.max - GAME_CONFIG.playerStatRange.min + 1)) + GAME_CONFIG.playerStatRange.min,
  };

  // Adjust stats based on position
  switch (position) {
    case 'GK':
      stats.defense += 5;
      stats.attack -= 3;
      break;
    case 'CB':
      stats.defense += 3;
      stats.attack -= 2;
      break;
    case 'LB':
    case 'RB':
      stats.speed += 2;
      stats.defense += 1;
      break;
    case 'CDM':
      stats.defense += 2;
      stats.stamina += 1;
      break;
    case 'CM':
      stats.stamina += 2;
      break;
    case 'CAM':
      stats.attack += 2;
      stats.defense -= 1;
      break;
    case 'LW':
    case 'RW':
      stats.speed += 3;
      stats.attack += 1;
      break;
    case 'ST':
    case 'CF':
      stats.attack += 4;
      stats.defense -= 2;
      break;
  }

  return {
    id: uuidv4(),
    name: `${firstName} ${lastName}`,
    position,
    stats,
    age: Math.floor(Math.random() * 15) + 18, // 18-32 years old
    nationality,
    value: calculatePlayerValue(stats),
    isInjured: false,
    trainingProgress: 0,
    energy: 100,
  };
}

/**
 * Calculate player value based on stats
 */
export function calculatePlayerValue(stats: PlayerStats): number {
  const totalStats = stats.stamina + stats.attack + stats.defense + stats.speed;
  return Math.floor(totalStats * 100 + Math.random() * 5000);
}

/**
 * Generate a complete team with 21 players
 */
export function generateTeam(teamName: string, managerId: string): Team {
  const players: Player[] = [];
  
  // Generate players for each position
  const positions: PlayerPosition[] = [
    'GK', 'GK', // 2 goalkeepers
    'CB', 'CB', 'CB', 'CB', // 4 center backs
    'LB', 'LB', 'RB', 'RB', // 4 fullbacks
    'CDM', 'CDM', 'CM', 'CM', 'CM', 'CAM', // 6 midfielders
    'LW', 'RW', // 2 wingers
    'ST', 'ST', 'CF' // 3 forwards
  ];

  positions.forEach(position => {
    players.push(generateRandomPlayer(position));
  });

  return {
    id: uuidv4(),
    name: teamName,
    managerId,
    players,
    formation: FORMATIONS[0], // Default to 4-4-2
    stadium: {
      id: uuidv4(),
      name: `${teamName} Stadium`,
      capacity: 5000,
      level: 1,
      upgradeCost: 10000,
    },
    coins: 10000, // Starting coins
    trophies: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    createdAt: new Date(),
  };
}

/**
 * Calculate team strength based on formation and player stats
 */
export function calculateTeamStrength(team: Team): number {
  const formationPlayers = team.formation.positions;
  let totalStrength = 0;
  
  formationPlayers.forEach(formationPos => {
    const player = team.players.find(p => p.position === formationPos.position && !p.isInjured);
    if (player) {
      const playerStrength = (player.stats.stamina + player.stats.attack + player.stats.defense + player.stats.speed) / 4;
      totalStrength += playerStrength;
    }
  });
  
  return totalStrength / formationPlayers.length;
}

/**
 * Simulate a match between two teams
 */
export function simulateMatch(homeTeam: Team, awayTeam: Team): Partial<Match> {
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  
  // Calculate match outcome probabilities
  const strengthDiff = homeStrength - awayStrength;
  const homeAdvantage = 2; // Home team gets slight advantage
  
  let homeWinProb = 0.33 + (strengthDiff + homeAdvantage) * 0.02;
  let drawProb = 0.34;
  let awayWinProb = 0.33 - (strengthDiff + homeAdvantage) * 0.02;
  
  // Normalize probabilities
  const total = homeWinProb + drawProb + awayWinProb;
  homeWinProb /= total;
  drawProb /= total;
  awayWinProb /= total;
  
  // Determine match result
  const random = Math.random();
  let homeScore = 0;
  let awayScore = 0;
  
  if (random < homeWinProb) {
    // Home win
    homeScore = Math.floor(Math.random() * 3) + 1; // 1-3 goals
    awayScore = Math.floor(Math.random() * homeScore); // 0 to homeScore-1
  } else if (random < homeWinProb + drawProb) {
    // Draw
    const goals = Math.floor(Math.random() * 4); // 0-3 goals each
    homeScore = goals;
    awayScore = goals;
  } else {
    // Away win
    awayScore = Math.floor(Math.random() * 3) + 1; // 1-3 goals
    homeScore = Math.floor(Math.random() * awayScore); // 0 to awayScore-1
  }
  
  // Generate match events
  const events: MatchEvent[] = [];
  const totalGoals = homeScore + awayScore;
  
  // Generate goal events
  for (let i = 0; i < totalGoals; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const isHomeGoal = i < homeScore;
    const team = isHomeGoal ? homeTeam : awayTeam;
    const attackers = team.players.filter(p => 
      ['ST', 'CF', 'CAM', 'LW', 'RW'].includes(p.position)
    );
    const scorer = attackers[Math.floor(Math.random() * attackers.length)];
    
    events.push({
      minute,
      type: 'goal',
      playerId: scorer.id,
      teamId: team.id,
      description: `Goal by ${scorer.name}!`,
    });
  }
  
  // Generate random cards
  const cardEvents = Math.floor(Math.random() * 4); // 0-3 cards
  for (let i = 0; i < cardEvents; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const team = Math.random() < 0.5 ? homeTeam : awayTeam;
    const player = team.players[Math.floor(Math.random() * team.players.length)];
    const cardType = Math.random() < 0.8 ? 'yellow_card' : 'red_card';
    
    events.push({
      minute,
      type: cardType,
      playerId: player.id,
      teamId: team.id,
      description: `${cardType === 'yellow_card' ? 'Yellow' : 'Red'} card for ${player.name}`,
    });
  }
  
  // Sort events by minute
  events.sort((a, b) => a.minute - b.minute);
  
  // Generate match stats
  const homeStats: MatchStats = {
    possession: Math.floor(Math.random() * 30) + 35, // 35-65%
    shots: Math.floor(Math.random() * 10) + 5, // 5-14 shots
    shotsOnTarget: Math.floor(Math.random() * 5) + homeScore, // At least as many as goals
    corners: Math.floor(Math.random() * 8) + 2, // 2-9 corners
    fouls: Math.floor(Math.random() * 10) + 5, // 5-14 fouls
    yellowCards: events.filter(e => e.teamId === homeTeam.id && e.type === 'yellow_card').length,
    redCards: events.filter(e => e.teamId === homeTeam.id && e.type === 'red_card').length,
  };
  
  const awayStats: MatchStats = {
    possession: 100 - homeStats.possession,
    shots: Math.floor(Math.random() * 10) + 5,
    shotsOnTarget: Math.floor(Math.random() * 5) + awayScore,
    corners: Math.floor(Math.random() * 8) + 2,
    fouls: Math.floor(Math.random() * 10) + 5,
    yellowCards: events.filter(e => e.teamId === awayTeam.id && e.type === 'yellow_card').length,
    redCards: events.filter(e => e.teamId === awayTeam.id && e.type === 'red_card').length,
  };
  
  return {
    homeScore,
    awayScore,
    events,
    homeStats,
    awayStats,
    status: 'finished',
    finishedAt: new Date(),
  };
}

/**
 * Generate AI team names
 */
export function generateAITeamNames(): string[] {
  const cities = [
    'Manchester', 'Barcelona', 'Madrid', 'Milan', 'Liverpool', 'Arsenal',
    'Chelsea', 'Bayern', 'Juventus', 'Paris', 'Atletico', 'Borussia',
    'Inter', 'Roma', 'Napoli', 'Valencia', 'Sevilla', 'Porto',
    'Benfica', 'Ajax', 'Celtic'
  ];
  
  const suffixes = ['FC', 'United', 'City', 'Athletic', 'Real', 'Club'];
  
  const teams: string[] = [];
  const usedNames = new Set<string>();
  
  while (teams.length < 21) { // 21 AI teams + 1 player team = 22 total
    const city = cities[Math.floor(Math.random() * cities.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const teamName = `${city} ${suffix}`;
    
    if (!usedNames.has(teamName)) {
      teams.push(teamName);
      usedNames.add(teamName);
    }
  }
  
  return teams;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate energy refill time
 */
export function calculateEnergyRefillTime(currentEnergy: number, maxEnergy: number): number {
  const energyNeeded = maxEnergy - currentEnergy;
  return energyNeeded * GAME_CONFIG.energyRefillRate; // minutes
}

/**
 * Check if player can be trained
 */
export function canTrainPlayer(player: Player, userEnergy: number, userCoins: number): boolean {
  return (
    !player.isInjured &&
    player.energy >= 20 &&
    userEnergy >= GAME_CONFIG.trainingCosts.energy &&
    userCoins >= GAME_CONFIG.trainingCosts.coins
  );
}

/**
 * Generate referral code
 */
export function generateReferralCode(userId: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}