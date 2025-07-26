import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { TrophyIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TeamCreationPage() {
  const { createTeam, state } = useGame();
  const [teamName, setTeamName] = useState('');
  const [errors, setErrors] = useState<string>('');

  const validateTeamName = (name: string) => {
    if (!name.trim()) {
      return 'Team name is required';
    }
    if (name.trim().length < 3) {
      return 'Team name must be at least 3 characters';
    }
    if (name.trim().length > 30) {
      return 'Team name must be less than 30 characters';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateTeamName(teamName);
    if (error) {
      setErrors(error);
      return;
    }

    const success = await createTeam(teamName.trim());
    
    if (!success) {
      // Error is handled by the context and toast
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamName(value);
    
    // Clear error when user starts typing
    if (errors) {
      setErrors('');
    }
  };

  const suggestedNames = [
    'Thunder FC',
    'Lightning United',
    'Phoenix City',
    'Storm Athletic',
    'Eagle FC',
    'Titan United',
    'Warrior FC',
    'Champion City',
    'Victory United',
    'Glory FC'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soccer-green to-soccer-darkgreen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-soccer-green rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Your Team</h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose a name for your football club and start your journey as a manager
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                value={teamName}
                onChange={handleChange}
                className={`mt-1 input-field ${errors ? 'border-red-500' : ''}`}
                placeholder="Enter your team name"
                maxLength={30}
              />
              {errors && (
                <p className="mt-1 text-sm text-red-600">{errors}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {teamName.length}/30 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full btn-primary flex justify-center items-center disabled:opacity-50"
            >
              {state.isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating team...
                </>
              ) : (
                'Create Team'
              )}
            </button>
          </form>

          {/* Suggested names */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Need inspiration? Try these names:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTeamName(name)}
                  className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-left"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Features preview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              What you'll get:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-soccer-green rounded-full mr-3"></div>
                21 randomly generated players
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-soccer-green rounded-full mr-3"></div>
                10,000 starting coins
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-soccer-green rounded-full mr-3"></div>
                Your own stadium
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-soccer-green rounded-full mr-3"></div>
                Access to tournaments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}