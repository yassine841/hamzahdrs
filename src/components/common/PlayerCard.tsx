import React from 'react';
import { Player } from '../../types';
import { formatNumber } from '../../utils/gameUtils';

interface PlayerCardProps {
  player: Player;
  showActions?: boolean;
  onTrain?: (player: Player) => void;
  className?: string;
}

export default function PlayerCard({ 
  player, 
  showActions = false, 
  onTrain,
  className = '' 
}: PlayerCardProps) {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK':
        return 'bg-yellow-100 text-yellow-800';
      case 'CB':
      case 'LB':
      case 'RB':
        return 'bg-blue-100 text-blue-800';
      case 'CDM':
      case 'CM':
      case 'CAM':
      case 'LM':
      case 'RM':
        return 'bg-green-100 text-green-800';
      case 'LW':
      case 'RW':
      case 'ST':
      case 'CF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatColor = (stat: number) => {
    if (stat >= 45) return 'bg-green-500';
    if (stat >= 40) return 'bg-yellow-500';
    if (stat >= 35) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const overallRating = Math.round(
    (player.stats.stamina + player.stats.attack + player.stats.defense + player.stats.speed) / 4
  );

  return (
    <div className={`card hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{player.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <span className="text-sm text-gray-500">{player.nationality}</span>
            <span className="text-sm text-gray-500">Age {player.age}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{overallRating}</div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Stamina</span>
          <div className="flex items-center space-x-2">
            <div className="stat-bar w-20">
              <div 
                className={`stat-fill ${getStatColor(player.stats.stamina)}`}
                style={{ width: `${(player.stats.stamina / 50) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">
              {player.stats.stamina}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Attack</span>
          <div className="flex items-center space-x-2">
            <div className="stat-bar w-20">
              <div 
                className={`stat-fill ${getStatColor(player.stats.attack)}`}
                style={{ width: `${(player.stats.attack / 50) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">
              {player.stats.attack}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Defense</span>
          <div className="flex items-center space-x-2">
            <div className="stat-bar w-20">
              <div 
                className={`stat-fill ${getStatColor(player.stats.defense)}`}
                style={{ width: `${(player.stats.defense / 50) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">
              {player.stats.defense}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Speed</span>
          <div className="flex items-center space-x-2">
            <div className="stat-bar w-20">
              <div 
                className={`stat-fill ${getStatColor(player.stats.speed)}`}
                style={{ width: `${(player.stats.speed / 50) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">
              {player.stats.speed}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Value: <span className="font-medium">{formatNumber(player.value)}</span>
        </div>
        
        {player.isInjured && (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Injured
          </span>
        )}
        
        {player.energy < 50 && !player.isInjured && (
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
            Tired
          </span>
        )}
      </div>

      {/* Actions */}
      {showActions && onTrain && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onTrain(player)}
            disabled={player.isInjured || player.energy < 20}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Train Player
          </button>
        </div>
      )}
    </div>
  );
}