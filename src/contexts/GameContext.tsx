import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Team, Tournament, GameState } from '../types';
import { AuthService, TeamService, TournamentService, UserService } from '../services/gameService';
import toast from 'react-hot-toast';

// Action types
type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TEAM'; payload: Team | null }
  | { type: 'SET_TOURNAMENT'; payload: Tournament | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_TEAM'; payload: Partial<Team> };

// Initial state
const initialState: GameState = {
  user: null,
  team: null,
  currentTournament: null,
  isLoading: true,
  error: null,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TEAM':
      return { ...state, team: action.payload };
    case 'SET_TOURNAMENT':
      return { ...state, currentTournament: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'UPDATE_TEAM':
      return {
        ...state,
        team: state.team ? { ...state.team, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  // Auth functions
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  // Team functions
  createTeam: (teamName: string) => Promise<boolean>;
  updateTeam: (updates: Partial<Team>) => Promise<boolean>;
  // User functions
  updateUserCoins: (coins: number) => Promise<void>;
  updateUserEnergy: (energy: number) => Promise<void>;
  refreshUserEnergy: () => Promise<void>;
  // Tournament functions
  loadCurrentTournament: () => Promise<void>;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auth functions
  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const result = await AuthService.register(email, password, displayName);
    
    if (result.success && result.data) {
      dispatch({ type: 'SET_USER', payload: result.data });
      toast.success('Account created successfully!');
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } else {
      dispatch({ type: 'SET_ERROR', payload: result.error || 'Registration failed' });
      toast.error(result.error || 'Registration failed');
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const result = await AuthService.login(email, password);
    
    if (result.success && result.data) {
      dispatch({ type: 'SET_USER', payload: result.data });
      
      // Load user's team if they have one
      if (result.data.teamId) {
        const teamResult = await TeamService.getTeam(result.data.teamId);
        if (teamResult.success && teamResult.data) {
          dispatch({ type: 'SET_TEAM', payload: teamResult.data });
        }
      }
      
      toast.success('Logged in successfully!');
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } else {
      dispatch({ type: 'SET_ERROR', payload: result.error || 'Login failed' });
      toast.error(result.error || 'Login failed');
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_TEAM', payload: null });
    dispatch({ type: 'SET_TOURNAMENT', payload: null });
    toast.success('Logged out successfully!');
  };

  // Team functions
  const createTeam = async (teamName: string): Promise<boolean> => {
    if (!state.user) return false;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    const result = await TeamService.createTeam(teamName, state.user.id);
    
    if (result.success && result.data) {
      dispatch({ type: 'SET_TEAM', payload: result.data });
      dispatch({ type: 'UPDATE_USER', payload: { teamId: result.data.id } });
      toast.success('Team created successfully!');
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } else {
      dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to create team' });
      toast.error(result.error || 'Failed to create team');
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const updateTeam = async (updates: Partial<Team>): Promise<boolean> => {
    if (!state.team) return false;

    const result = await TeamService.updateTeam(state.team.id, updates);
    
    if (result.success) {
      dispatch({ type: 'UPDATE_TEAM', payload: updates });
      return true;
    } else {
      toast.error(result.error || 'Failed to update team');
      return false;
    }
  };

  // User functions
  const updateUserCoins = async (coins: number): Promise<void> => {
    if (!state.user) return;

    const result = await UserService.updateUser(state.user.id, { coins });
    
    if (result.success) {
      dispatch({ type: 'UPDATE_USER', payload: { coins } });
    }
  };

  const updateUserEnergy = async (energy: number): Promise<void> => {
    if (!state.user) return;

    const result = await UserService.updateUser(state.user.id, { energy });
    
    if (result.success) {
      dispatch({ type: 'UPDATE_USER', payload: { energy } });
    }
  };

  const refreshUserEnergy = async (): Promise<void> => {
    if (!state.user) return;

    const result = await UserService.updateEnergy(state.user.id);
    
    if (result.success && result.data) {
      dispatch({ type: 'SET_USER', payload: result.data });
    }
  };

  // Tournament functions
  const loadCurrentTournament = async (): Promise<void> => {
    const result = await TournamentService.getCurrentTournament();
    
    if (result.success) {
      dispatch({ type: 'SET_TOURNAMENT', payload: result.data });
    }
  };

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userResult = await AuthService.getUserData(firebaseUser.uid);
        
        if (userResult.success && userResult.data) {
          dispatch({ type: 'SET_USER', payload: userResult.data });
          
          // Load user's team if they have one
          if (userResult.data.teamId) {
            const teamResult = await TeamService.getTeam(userResult.data.teamId);
            if (teamResult.success && teamResult.data) {
              dispatch({ type: 'SET_TEAM', payload: teamResult.data });
            }
          }
          
          // Load current tournament
          await loadCurrentTournament();
        }
      } else {
        // User is signed out
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_TEAM', payload: null });
        dispatch({ type: 'SET_TOURNAMENT', payload: null });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

  // Auto-refresh energy every minute
  useEffect(() => {
    if (!state.user) return;

    const interval = setInterval(() => {
      refreshUserEnergy();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [state.user]);

  const contextValue: GameContextType = {
    state,
    register,
    login,
    logout,
    createTeam,
    updateTeam,
    updateUserCoins,
    updateUserEnergy,
    refreshUserEnergy,
    loadCurrentTournament,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}