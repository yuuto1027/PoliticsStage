import React from 'react';
import { VoteResult } from '../types';
import playSound from '../services/audioService';

interface VoteResultModalProps {
  result: VoteResult;
  onClose: () => void;
}

const VoteResultModal: React.FC<VoteResultModalProps> = ({ result, onClose }) => {
  const { isPassed, lawName, approveVotes, opposeVotes, partyVotes } = result;
  const totalVotes = approveVotes + opposeVotes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 animate-fade-in-scale-up">
        <h2 className="text-xl font-bold text-center text-slate-300 mb-2">採決結果</h2>
        <h3 className="text-2xl font-semibold text-center text-white mb-4">{lawName}</h3>

        <div className={`text-center my-6 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
          <p className="text-6xl font-bold animate-pulse-once">{isPassed ? '可決' : '否決'}</p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center text-lg font-bold mb-2">
            <span className="text-green-400">賛成: {approveVotes}</span>
            <span className="text-red-400">反対: {opposeVotes}</span>
          </div>
          <div className="w-full bg-red-500 rounded-full h-6 overflow-hidden border-2 border-slate-600">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${totalVotes > 0 ? (approveVotes / totalVotes) * 100 : 0}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-center text-slate-400">各党の投票</h4>
          <div className="max-h-48 overflow-y-auto bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-sm">
            <ul className="divide-y divide-slate-700">
              {partyVotes.map(({ partyName, vote, seats }) => (
                <li key={partyName} className="flex justify-between items-center py-2">
                  <span>{partyName} ({seats}議席)</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${vote === 'approve' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {vote === 'approve' ? '賛成' : '反対'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md transition duration-300"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteResultModal;