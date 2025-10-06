

import React from 'react';
import { BillToVoteOn } from '../types';

interface VoteOnBillModalProps {
  bill: BillToVoteOn;
  onVote: (vote: 'approve' | 'oppose') => void;
}

const VoteOnBillModal: React.FC<VoteOnBillModalProps> = ({ bill, onVote }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 animate-fade-in-scale-up">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">法案採決</h2>
        <p className="text-sm text-slate-400 mb-4">{bill.proposerPartyName}からの提出法案</p>
        
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">{bill.lawName}</h3>
            <p className="text-slate-400">{bill.lawDescription}</p>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
                <h4 className="font-bold mb-2 text-lg">予測される効果</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>国庫: <span className={bill.lawEffect.resourceChanges.treasury > 0 ? 'text-green-400' : 'text-red-400'}>{bill.lawEffect.resourceChanges.treasury.toLocaleString()}</span></p>
                    <p>人的資源: <span className={bill.lawEffect.resourceChanges.manpower > 0 ? 'text-green-400' : 'text-red-400'}>{bill.lawEffect.resourceChanges.manpower.toLocaleString()}</span></p>
                    <p>研究P: <span className={bill.lawEffect.resourceChanges.researchPoints > 0 ? 'text-green-400' : 'text-red-400'}>{bill.lawEffect.resourceChanges.researchPoints}</span></p>
                    <p>軍事力: <span className={bill.lawEffect.resourceChanges.militaryPower > 0 ? 'text-green-400' : 'text-red-400'}>{bill.lawEffect.resourceChanges.militaryPower}</span></p>
                </div>
                <div className="mt-4">
                    <h5 className="font-semibold text-cyan-300">各派閥の反応</h5>
                    <ul className="list-none text-slate-300 text-sm space-y-1 mt-2">
                        {/* FIX: Use Object.entries to iterate and ensure correct type inference for `change`. */}
                        {Object.entries(bill.lawEffect.factionHappinessChanges).map(([faction, change]) => {
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
                        {bill.lawEffect.effects.buff.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>
                <div className="mt-2">
                    <h5 className="font-semibold text-red-400">デバフ</h5>
                    <ul className="list-disc list-inside text-slate-300">
                        {bill.lawEffect.effects.debuff.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </div>
            </div>
             <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => onVote('oppose')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">
                    反対
                </button>
                <button onClick={() => onVote('approve')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">
                    賛成
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VoteOnBillModal;
