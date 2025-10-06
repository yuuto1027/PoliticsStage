import React from 'react';
import { Minister } from '../types';
// FIX: Changed to a default import for playSound.
import playSound from '../services/audioService';

interface HireMinisterModalProps {
  candidates: Minister[];
  onHire: (minister: Minister) => void;
  onClose: () => void;
}

const HireMinisterModal: React.FC<HireMinisterModalProps> = ({ candidates, onHire, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl p-6 border border-slate-700 max-h-[90vh] overflow-y-auto animate-fade-in-scale-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-300">人材発掘 結果</h2>
          <button onClick={() => { playSound('click'); onClose(); }} className="text-slate-400 hover:text-white text-3xl">&times;</button>
        </div>
        <p className="text-slate-400 mb-6">以下の候補者が見つかりました。内閣に迎える大臣を一人選んでください。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.map(candidate => (
                <div key={candidate.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold">{candidate.lastName} {candidate.firstName}</h3>
                        <p className="font-semibold text-purple-300">{candidate.position}</p>
                        <p className="text-sm text-slate-400 mb-2">イデオロギー: {candidate.ideology}</p>
                        <div className="text-xs space-y-1">
                            {candidate.buffs.map((buff, i) => (
                                <p key={`buff-${i}`} className="text-green-400 flex items-start">
                                    <span className="mr-1 mt-0.5">＋</span>
                                    <span>{buff}</span>
                                </p>
                            ))}
                            {candidate.debuffs.map((debuff, i) => (
                                <p key={`debuff-${i}`} className="text-red-400 flex items-start">
                                    <span className="mr-1 mt-0.5">－</span>
                                    <span>{debuff}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => onHire(candidate)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        任命する
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HireMinisterModal;