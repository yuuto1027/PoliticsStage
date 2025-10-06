import React, { useState, useEffect } from 'react';
import { Minister } from '../types';
import playSound from '../services/audioService';

interface MinisterGachaAnimationModalProps {
  candidates: Minister[];
  onAnimationEnd: () => void;
}

const MinisterGachaAnimationModal: React.FC<MinisterGachaAnimationModalProps> = ({ candidates, onAnimationEnd }) => {
  const [revealed, setRevealed] = useState([false, false, false]);
  const [phase, setPhase] = useState<'shuffling' | 'revealing' | 'done'>('shuffling');

  useEffect(() => {
    playSound('action');
    const shuffleTimer = setTimeout(() => {
      setPhase('revealing');
    }, 2000); // 2 seconds of shuffling

    return () => clearTimeout(shuffleTimer);
  }, []);

  useEffect(() => {
    if (phase === 'revealing') {
      revealed.forEach((isRevealed, index) => {
        if (!isRevealed) {
          const revealTimer = setTimeout(() => {
            setRevealed(prev => {
              const newRevealed = [...prev];
              newRevealed[index] = true;
              return newRevealed;
            });
            playSound('success');
          }, (index + 1) * 800);
          return () => clearTimeout(revealTimer);
        }
      });

      const endTimer = setTimeout(() => {
        setPhase('done');
        onAnimationEnd();
      }, 3500); // After all reveals + buffer

      return () => clearTimeout(endTimer);
    }
  }, [phase]);

  const Card: React.FC<{ minister: Minister; isRevealed: boolean }> = ({ minister, isRevealed }) => (
    <div className={`transition-transform duration-700 w-52 h-72 preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
      {/* Card Back */}
      <div className="absolute w-full h-full bg-slate-700 border-2 border-purple-400 rounded-lg backface-hidden flex items-center justify-center">
        <div className="text-purple-300 text-5xl font-bold">?</div>
      </div>
      {/* Card Front */}
      <div className="absolute w-full h-full bg-slate-800 border border-slate-600 rounded-lg backface-hidden rotate-y-180 p-4 flex flex-col justify-between">
         <div>
            <h3 className="text-lg font-bold">{minister.lastName} {minister.firstName}</h3>
            <p className="font-semibold text-purple-300">{minister.position}</p>
            <p className="text-sm text-slate-400 mb-2">イデオロギー: {minister.ideology}</p>
        </div>
        <div className="text-xs space-y-1">
            {minister.buffs.map((buff, i) => (
                <p key={`buff-${i}`} className="text-green-400">+ {buff}</p>
            ))}
            {minister.debuffs.map((debuff, i) => (
                <p key={`debuff-${i}`} className="text-red-400">- {debuff}</p>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4 perspective-1000">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-300 mb-6 animate-pulse">人材を発掘中...</h2>
        <div className="flex justify-center items-center gap-6">
            {candidates.map((candidate, index) => (
                <Card key={candidate.id} minister={candidate} isRevealed={revealed[index]} />
            ))}
        </div>
        {/* FIX: Replaced non-standard <style jsx> with a standard <style> tag to resolve TypeScript error. */}
        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
      </div>
    </div>
  );
};

export default MinisterGachaAnimationModal;