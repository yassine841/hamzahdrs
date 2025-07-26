import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { 
  Coins, 
  Zap, 
  LogOut 
} from 'lucide-react';
import { formatNumber } from '../../utils/gameUtils';

export default function Header() {
  const { state, logout } = useGame();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Team', href: '/team', icon: UserGroupIcon },
    { name: 'Tournament', href: '/tournament', icon: TrophyIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (!state.user) {
    return null;
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-soccer-green rounded-full flex items-center justify-center mr-3">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Soccer Manager
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-soccer-green text-white'
                      : 'text-gray-700 hover:text-soccer-green hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User stats and actions */}
          <div className="flex items-center space-x-4">
            {/* Coins */}
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600 mr-1" />
              <span className="text-sm font-medium text-yellow-800">
                {formatNumber(state.user.coins)}
              </span>
            </div>

            {/* Energy */}
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-800">
                {state.user.energy}/{state.user.maxEnergy}
              </span>
            </div>

            {/* User menu - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {state.user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-soccer-green text-white'
                      : 'text-gray-700 hover:text-soccer-green hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile user section */}
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {state.user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}