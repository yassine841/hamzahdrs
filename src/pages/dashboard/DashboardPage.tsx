import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { 
  TrophyIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  PlayIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { 
  Coins, 
  Zap, 
  Calendar, 
  Target,
  Users,
  Award
} from 'lucide-react';
import { formatNumber, calculateTeamStrength } from '../../utils/gameUtils';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { state } = useGame();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!state.user || !state.team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading your team...</h2>
        </div>
      </div>
    );
  }

  const teamStrength = calculateTeamStrength(state.team);
  const availablePlayers = state.team.players.filter(p => !p.isInjured).length;
  const injuredPlayers = state.team.players.filter(p => p.isInjured).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {state.user.displayName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your team, train players, and compete in tournaments
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Coins */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Coins className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Coins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(state.user.coins)}
                </p>
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Energy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.user.energy}/{state.user.maxEnergy}
                </p>
              </div>
            </div>
          </div>

          {/* Trophies */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Trophies</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.team.trophies}
                </p>
              </div>
            </div>
          </div>

          {/* Team Strength */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Team Strength</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(teamStrength)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {state.team.name}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{state.team.wins}</div>
                    <div className="text-sm text-gray-500">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{state.team.draws}</div>
                    <div className="text-sm text-gray-500">Draws</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{state.team.losses}</div>
                    <div className="text-sm text-gray-500">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{availablePlayers}</div>
                    <div className="text-sm text-gray-500">Available</div>
                  </div>
                </div>

                {injuredPlayers > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Injured Players
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          You have {injuredPlayers} injured player{injuredPlayers > 1 ? 's' : ''}. 
                          They will recover automatically over time.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Stadium</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{state.team.stadium.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Capacity: {formatNumber(state.team.stadium.capacity)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Formation</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <CogIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{state.team.formation.name}</span>
                      </div>
                      <Link
                        to="/team"
                        className="text-sm text-soccer-green hover:text-soccer-darkgreen"
                      >
                        Change
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Tournament Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2" />
                  Tournament
                </h2>
              </div>
              <div className="p-6">
                {state.currentTournament ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {state.currentTournament.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Status: <span className="font-medium capitalize">{state.currentTournament.status}</span>
                    </p>
                    <Link
                      to="/tournament"
                      className="w-full btn-primary block text-center"
                    >
                      View Tournament
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      No active tournament. Check back later for new tournaments!
                    </p>
                    <button className="w-full btn-secondary" disabled>
                      No Tournament Available
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to="/team"
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Link>
                
                <Link
                  to="/leaderboard"
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Link>

                {state.currentTournament && (
                  <Link
                    to="/tournament"
                    className="w-full btn-success flex items-center justify-center"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Join Tournament
                  </Link>
                )}
              </div>
            </div>

            {/* Energy Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Energy Status
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Current Energy</span>
                    <span>{state.user.energy}/{state.user.maxEnergy}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(state.user.energy / state.user.maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Energy refills automatically over time. Use energy to train your players.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}