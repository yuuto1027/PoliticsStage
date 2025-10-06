
import React, { useState, useMemo } from 'react';
import { generateLawEffect } from '../services/geminiService';
import { LawEffect, GameState, FactionName } from '../types';
// FIX: Changed to a default import for playSound.
import playSound from '../services/audioService';

interface ProposeLawModalProps {
  onClose: () => void;
  onPropose: (lawName: string, lawDescription: string, effect: LawEffect) => void;
  gameState: GameState;
}

const LAW_PROPOSAL_COST = 20;

const ProposeLawModal: React.FC<ProposeLawModalProps> = ({ onClose, onPropose, gameState }) => {
  const [lawName, setLawName] = useState('');
  const [lawDescription, setLawDescription] = useState('');
  const [generatedEffect, setGeneratedEffect] = useState<LawEffect | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { playerStats, country } = gameState;
  const politicalPower = playerStats.politicalPower;

  const handleGenerateEffect = async () => {
    if (!lawName || !lawDescription) return;
    playSound('click');
    setIsLoading(true);
    setError('');
    try {
      const effect = await generateLawEffect(lawName, lawDescription);
      setGeneratedEffect(effect);
      playSound('success');
    } catch (err) {
      setError('効果の生成に失敗しました。もう一度お試しください。');
      playSound('failure');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePropose = () => {
    if (generatedEffect && canAffordLaw && politicalPower >= LAW_PROPOSAL_COST) {
        playSound('next_turn');
        onPropose(lawName, lawDescription, generatedEffect);
    }
  };

  const canAffordLaw = useMemo(() => {
    if (!generatedEffect) return false;
    const { resourceChanges } = generatedEffect;
    return (
      country.treasury + resourceChanges.treasury >= 0 &&
      country.manpower + resourceChanges.manpower >= 0 &&
      country.researchPoints + resourceChanges.researchPoints >= 0 &&
      country.militaryPower + resourceChanges.militaryPower >= 0
    );
  }, [generatedEffect, country]);

  const getDisabledTitle = () => {
    if (politicalPower < LAW_PROPOSAL_COST) {
      return `政治力が足りません (${LAW_PROPOSAL_COST}必要)`;
    }
    if (generatedEffect && !canAffordLaw) {
      return '法案の施行に必要な国庫や資源が不足しています。';
    }
    return '';
  };

  const proposeButtonDisabled = politicalPower < LAW_PROPOSAL_COST || (!!generatedEffect && !canAffordLaw);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 max-h-[90vh] overflow-y-auto animate-fade-in-scale-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">法案の起草</h2>
          <button onClick={() => { playSound('click'); onClose(); }} className="text-slate-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        {!generatedEffect ? (
            <div className="space-y-4">
            <div>
                <label htmlFor="law-name" className="block text-sm font-medium text-slate-300 mb-1">法律名</label>
                <input id="law-name" type="text" value={lawName} onChange={(e) => setLawName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label htmlFor="law-description" className="block text-sm font-medium text-slate-300 mb-1">法案の説明</label>
                <textarea id="law-description" value={lawDescription} onChange={(e) => setLawDescription(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="text-right">
                <button onClick={handleGenerateEffect} disabled={isLoading || !lawName || !lawDescription} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-600">
                {isLoading ? '生成中...' : '法案効果を生成'}
                </button>
            </div>
            </div>
        ) : (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">{lawName}</h3>
                <p className="text-slate-400">{lawDescription}</p>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold mb-2 text-lg">予測される効果</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <p>国庫: <span className={generatedEffect.resourceChanges.treasury >= 0 ? 'text-green-400' : 'text-red-400'}>{generatedEffect.resourceChanges.treasury.toLocaleString()}</span></p>
                        <p>人的資源: <span className={generatedEffect.resourceChanges.manpower >= 0 ? 'text-green-400' : 'text-red-400'}>{generatedEffect.resourceChanges.manpower.toLocaleString()}</span></p>
                        <p>研究P: <span className={generatedEffect.resourceChanges.researchPoints >= 0 ? 'text-green-400' : 'text-red-400'}>{generatedEffect.resourceChanges.researchPoints}</span></p>
                        <p>軍事力: <span className={generatedEffect.resourceChanges.militaryPower >= 0 ? 'text-green-400' : 'text-red-400'}>{generatedEffect.resourceChanges.militaryPower.toLocaleString()}</span></p>
                    </div>
                     <div className="mt-4">
                        <h5 className="font-semibold text-cyan-300">各派閥の反応</h5>
                        <ul className="list-none text-slate-300 text-sm space-y-1 mt-2">
                            {/* FIX: Use Object.entries to iterate and ensure correct type inference for `change`. */}
                            {Object.entries(generatedEffect.factionHappinessChanges).map(([faction, change]) => {
                                return (
                                <li key={faction} className="flex justify-between">
                                    <span>{faction}</span>
                                    <span className={change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : ''}>
                                        {change > 0 ? '+' : ''}{change}%
                                    </span>
                                </li>
                            )})}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h5 className="font-semibold text-green-400">バフ</h5>
                        <ul className="list-disc list-inside text-slate-300">
                            {generatedEffect.effects.buff.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                    </div>
                    <div className="mt-2">
                        <h5 className="font-semibold text-red-400">デバフ</h5>
                        <ul className="list-disc list-inside text-slate-300">
                            {generatedEffect.effects.debuff.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                </div>
                 <div className="flex justify-end items-center space-x-4 mt-6">
                    <button onClick={() => { playSound('click'); setGeneratedEffect(null); }} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        再生成
                    </button>
                    <button 
                        onClick={handlePropose} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                        disabled={proposeButtonDisabled}
                        title={getDisabledTitle()}
                    >
                        議会に提出 (政治力 -{LAW_PROPOSAL_COST})
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProposeLawModal;
