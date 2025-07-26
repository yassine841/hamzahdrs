import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { User, Team, Tournament, Match, LeaderboardEntry, ApiResponse } from '../types';
import { generateTeam, generateAITeamNames, generateReferralCode } from '../utils/gameUtils';

/**
 * Authentication Services
 */
export class AuthService {
  static async register(email: string, password: string, displayName: string): Promise<ApiResponse<User>> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        teamId: '',
        coins: 10000,
        energy: 100,
        maxEnergy: 100,
        lastEnergyRefill: new Date(),
        referralCode: generateReferralCode(firebaseUser.uid),
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
        lastEnergyRefill: Timestamp.fromDate(userData.lastEnergyRefill),
      });
      
      return { success: true, data: userData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await this.getUserData(userCredential.user.uid);
      
      if (userData.success) {
        return userData;
      } else {
        return { success: false, error: 'User data not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async logout(): Promise<ApiResponse<void>> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getUserData(userId: string): Promise<ApiResponse<User>> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const userData: User = {
          ...data,
          createdAt: data.createdAt.toDate(),
          lastEnergyRefill: data.lastEnergyRefill.toDate(),
        } as User;
        
        return { success: true, data: userData };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

/**
 * Team Services
 */
export class TeamService {
  static async createTeam(teamName: string, managerId: string): Promise<ApiResponse<Team>> {
    try {
      const team = generateTeam(teamName, managerId);
      
      // Save team to Firestore
      await setDoc(doc(db, 'teams', team.id), {
        ...team,
        createdAt: Timestamp.fromDate(team.createdAt),
      });
      
      // Update user's teamId
      await updateDoc(doc(db, 'users', managerId), {
        teamId: team.id,
      });
      
      return { success: true, data: team };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getTeam(teamId: string): Promise<ApiResponse<Team>> {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      
      if (teamDoc.exists()) {
        const data = teamDoc.data();
        const team: Team = {
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Team;
        
        return { success: true, data: team };
      } else {
        return { success: false, error: 'Team not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async updateTeam(teamId: string, updates: Partial<Team>): Promise<ApiResponse<void>> {
    try {
      await updateDoc(doc(db, 'teams', teamId), updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async updatePlayerStats(teamId: string, playerId: string, statUpdates: any): Promise<ApiResponse<void>> {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      
      if (teamDoc.exists()) {
        const team = teamDoc.data() as Team;
        const playerIndex = team.players.findIndex(p => p.id === playerId);
        
        if (playerIndex !== -1) {
          team.players[playerIndex] = { ...team.players[playerIndex], ...statUpdates };
          
          await updateDoc(doc(db, 'teams', teamId), {
            players: team.players,
          });
          
          return { success: true };
        } else {
          return { success: false, error: 'Player not found' };
        }
      } else {
        return { success: false, error: 'Team not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Tournament Services
 */
export class TournamentService {
  static async createTournament(): Promise<ApiResponse<Tournament>> {
    try {
      // Get all user teams
      const teamsQuery = query(collection(db, 'teams'));
      const teamsSnapshot = await getDocs(teamsQuery);
      const userTeams = teamsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Team[];
      
      // Generate AI teams if needed
      const aiTeamNames = generateAITeamNames();
      const aiTeams: Team[] = [];
      
      for (let i = 0; i < Math.min(21, 22 - userTeams.length); i++) {
        const aiTeam = generateTeam(aiTeamNames[i], 'ai');
        aiTeams.push(aiTeam);
      }
      
      // Combine user and AI teams
      const allTeams = [...userTeams.slice(0, 22 - aiTeams.length), ...aiTeams];
      
      // Create tournament
      const tournament: Tournament = {
        id: `tournament-${Date.now()}`,
        name: `Weekly Tournament ${new Date().toLocaleDateString()}`,
        teams: allTeams,
        matches: [],
        status: 'upcoming',
        currentRound: 1,
        totalRounds: Math.ceil(Math.log2(allTeams.length)),
        prize: {
          winner: 5000,
          runnerUp: 2500,
          semifinalist: 1000,
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };
      
      // Save tournament
      await setDoc(doc(db, 'tournaments', tournament.id), {
        ...tournament,
        startDate: Timestamp.fromDate(tournament.startDate),
        endDate: Timestamp.fromDate(tournament.endDate),
      });
      
      return { success: true, data: tournament };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getCurrentTournament(): Promise<ApiResponse<Tournament | null>> {
    try {
      const tournamentsQuery = query(
        collection(db, 'tournaments'),
        where('status', 'in', ['upcoming', 'active']),
        orderBy('startDate', 'desc'),
        limit(1)
      );
      
      const snapshot = await getDocs(tournamentsQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        const tournament: Tournament = {
          ...data,
          id: doc.id,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
        } as Tournament;
        
        return { success: true, data: tournament };
      } else {
        return { success: true, data: null };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Match Services
 */
export class MatchService {
  static async saveMatch(match: Match): Promise<ApiResponse<void>> {
    try {
      await setDoc(doc(db, 'matches', match.id), {
        ...match,
        scheduledAt: Timestamp.fromDate(match.scheduledAt),
        finishedAt: match.finishedAt ? Timestamp.fromDate(match.finishedAt) : null,
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getMatches(tournamentId: string): Promise<ApiResponse<Match[]>> {
    try {
      const matchesQuery = query(
        collection(db, 'matches'),
        where('tournamentId', '==', tournamentId),
        orderBy('scheduledAt', 'asc')
      );
      
      const snapshot = await getDocs(matchesQuery);
      const matches = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          scheduledAt: data.scheduledAt.toDate(),
          finishedAt: data.finishedAt ? data.finishedAt.toDate() : undefined,
        } as Match;
      });
      
      return { success: true, data: matches };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Leaderboard Services
 */
export class LeaderboardService {
  static async getLeaderboard(): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      const teamsQuery = query(
        collection(db, 'teams'),
        orderBy('trophies', 'desc'),
        orderBy('wins', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(teamsQuery);
      const leaderboard: LeaderboardEntry[] = [];
      
      for (let i = 0; i < snapshot.docs.length; i++) {
        const teamDoc = snapshot.docs[i];
        const team = teamDoc.data() as Team;
        
        // Get manager name
        let managerName = 'AI Manager';
        if (team.managerId !== 'ai') {
          const userDoc = await getDoc(doc(db, 'users', team.managerId));
          if (userDoc.exists()) {
            managerName = userDoc.data().displayName;
          }
        }
        
        leaderboard.push({
          rank: i + 1,
          userId: team.managerId,
          teamName: team.name,
          managerName,
          trophies: team.trophies,
          wins: team.wins,
        });
      }
      
      return { success: true, data: leaderboard };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * User Services
 */
export class UserService {
  static async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<void>> {
    try {
      const updateData: any = { ...updates };
      
      // Convert Date objects to Timestamps
      if (updates.lastEnergyRefill) {
        updateData.lastEnergyRefill = Timestamp.fromDate(updates.lastEnergyRefill);
      }
      
      await updateDoc(doc(db, 'users', userId), updateData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async updateEnergy(userId: string): Promise<ApiResponse<User>> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const now = new Date();
        const lastRefill = userData.lastEnergyRefill.toDate();
        const minutesPassed = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60));
        
        const energyToAdd = Math.floor(minutesPassed / 10); // 1 energy per 10 minutes
        const newEnergy = Math.min(userData.energy + energyToAdd, userData.maxEnergy);
        
        if (energyToAdd > 0) {
          await updateDoc(doc(db, 'users', userId), {
            energy: newEnergy,
            lastEnergyRefill: Timestamp.fromDate(now),
          });
          
          userData.energy = newEnergy;
          userData.lastEnergyRefill = now;
        }
        
        return { success: true, data: userData };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}