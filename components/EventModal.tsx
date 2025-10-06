import React, { useState } from 'react';
import { GameEvent, GameEventChoice, GameState } from '../types';

const resourceLabels: Record<string, string> = {
    treasury: '国庫',
    stability: '社会安定',
    manpower: '人的資源',
    researchPoints: '研究P',
    militaryPower: '軍事力',
    corruption: '腐敗度',
    partyFunds: '政党資金',
    politicalPower: '政治力',
};

const factionLabels: Record<string, string> = {
    '富裕層': '富裕層',
    '中間層': '中間層',
    '貧困層': '貧困層',
    '資本家': '資本家',
    '労働者': '労働者',
};

interface EventModalProps {
  event: GameEvent;
  onChoose: (choice: GameEventChoice) => void;
  gameState: GameState;
}

const EventModal: React.FC<EventModalProps> = ({ event, onChoose, gameState }) => {
  const [hoveredChoice, setHoveredChoice] = useState<GameEventChoice | null>(null);

  const eventTypeDetails: Record<GameEvent['type'], { label: string; color: string; bgColor: string; }> = {
    domestic: { label: '国内イベント', color: 'text-blue-300', bgColor: 'bg-blue-500/20' },
    international: { label: '国際イベント', color: 'text-green-300', bgColor: 'bg-green-500/20' },
    protest: { label: '抗議デモ', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  };

  const details = eventTypeDetails[event.type];

  const canAffordChoice = (choice: GameEventChoice): boolean => {
    const { resourceChanges, playerStatChanges } = choice.effects;
    const { country, playerStats } = gameState;

    if (resourceChanges) {
      for (const key in resourceChanges) {
        const resKey = key as keyof typeof resourceChanges;
        if ((country[resKey] || 0) + (resourceChanges[resKey] || 0) < 0) {
          return false;
        }
      }
    }
    if (playerStatChanges) {
      for (const key in playerStatChanges) {
        const statKey = key as keyof typeof playerStatChanges;
        if ((playerStats[statKey] || 0) + (playerStatChanges[statKey] || 0) < 0) {
          return false;
        }
      }
    }
    return true;
  };

  const allChoicesUnaffordable = event.choices.every(choice => !canAffordChoice(choice));

  const doNothingChoice: GameEventChoice = {
    text: "何もしない (資源不足)",
    effects: {
      resourceChanges: {},
      factionHappinessChanges: { '富裕層': -1, '中間層': -2, '貧困層': -3, '資本家': -1, '労働者': -2 },
      playerStatChanges: {},
      playerSupportChange: -1,
    },
  };

  const renderEffect = (label: string, value: number) => {
    if (value === 0) return null;
    const color = value > 0 ? 'text-green-400' : 'text-red-400';
    return (
        <li className="flex justify-between">
            <span>{label}</span>
            <span className={color}>{value > 0 ? '+' : ''}{value.toLocaleString()}</span>
        </li>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 animate-fade-in-scale-up">
        <div className="flex items-center mb-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-full mr-3 ${details.bgColor} ${details.color}`}>
            {details.label}
          </span>
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${details.color}`}>{event.title}</h2>
        <p className="text-slate-300 mb-6">{event.description}</p>
        
        <div className="space-y-3">
          {event.choices.map((choice, index) => {
            const isAffordable = canAffordChoice(choice);
            return (
                <button 
                  key={index}
                  onClick={() => onChoose(choice)}
                  onMouseEnter={() => setHoveredChoice(choice)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  disabled={!isAffordable}
                  className="w-full text-left bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
                  title={!isAffordable ? "この選択肢を実行するための資源が不足しています。" : ""}
                >
                  {choice.text}
                </button>
            )
          })}
          {allChoicesUnaffordable && (
            <button 
              onClick={() => onChoose(doNothingChoice)}
              onMouseEnter={() => setHoveredChoice(doNothingChoice)}
              onMouseLeave={() => setHoveredChoice(null)}
              className="w-full text-left bg-yellow-800 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              {doNothingChoice.text}
            </button>
          )}
        </div>
        
        <div className="mt-4 min-h-[12rem] transition-opacity duration-200">
            {hoveredChoice && (
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 animate-fade-in text-sm h-full max-h-48 overflow-y-auto">
                    <h4 className="font-bold mb-2 text-slate-300">予測される効果</h4>
                    <ul className="space-y-1 text-slate-400">
                        {hoveredChoice.effects.resourceChanges && Object.entries(hoveredChoice.effects.resourceChanges).map(([key, value]) => renderEffect(resourceLabels[key] || key, value as number))}
                        {hoveredChoice.effects.playerStatChanges && Object.entries(hoveredChoice.effects.playerStatChanges).map(([key, value]) => renderEffect(resourceLabels[key] || key, value as number))}
                        {renderEffect('支持率', hoveredChoice.effects.playerSupportChange)}
                        {hoveredChoice.effects.factionHappinessChanges && <li className="pt-2 font-semibold text-slate-300">派閥の幸福度</li>}
                        {/* FIX: Cast value to number as it is inferred as 'unknown' from Object.entries. */}
                        {hoveredChoice.effects.factionHappinessChanges && Object.entries(hoveredChoice.effects.factionHappinessChanges).map(([key, value]) => renderEffect(`${(factionLabels[key] || key)}`, value as number))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;