
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import playSound from '../services/audioService';

interface SpeechMinigameModalProps {
  onClose: () => void;
  onResult: (score: number) => void;
}

type Interest = 'economy' | 'environment' | 'welfare' | 'security';

const interests: { id: Interest; label: string; icon: string; }[] = [
  { id: 'economy', label: '経済', icon: '💰' },
  { id: 'environment', label: '環境', icon: '🌳' },
  { id: 'welfare', label: '福祉', icon: '❤️' },
  { id: 'security', label: '安全', icon: '🛡️' },
];

const GAME_DURATION = 15; // seconds
const TARGET_INTERVAL = 2500; // milliseconds

const SpeechMinigameModal: React.FC<SpeechMinigameModalProps> = ({ onClose, onResult }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<Interest | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateNewTarget = useCallback(() => {
    const nextTarget = interests[Math.floor(Math.random() * interests.length)];
    setCurrentTarget(nextTarget.id);
  }, []);

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    // Main game timer
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          setGamePhase('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Target generation timer
    const targetTimer = setInterval(() => {
        generateNewTarget();
    }, TARGET_INTERVAL);
    
    // Initial target
    generateNewTarget();

    return () => {
      clearInterval(gameTimer);
      clearInterval(targetTimer);
    };
  }, [gamePhase, generateNewTarget]);
  
  const handlePlayerChoice = (choice: Interest) => {
    if (gamePhase !== 'playing' || !currentTarget) return;
    
    if (choice === currentTarget) {
      playSound('success');
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      playSound('failure');
      setFeedback('incorrect');
    }
    
    setTimeout(() => setFeedback(null), 300);
    generateNewTarget();
  };
  
  const handleEndGame = () => {
    onResult(score);
  }

  const renderContent = () => {
    if (gamePhase === 'intro') {
      return (
        <div className="text-center">
            <p className="text-slate-300 mb-6">街頭演説ミニゲームへようこそ！<br />聴衆の関心事に合ったテーマで演説し、支持を集めましょう。</p>
            <button
              onClick={() => { playSound('click'); setGamePhase('playing'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition"
            >
              演説開始
            </button>
        </div>
      );
    }
    
    if (gamePhase === 'result') {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">演説終了！</h3>
          <p className="text-lg">スコア: <span className="font-bold text-yellow-300">{score}</span></p>
          <p className="text-slate-400 mt-2">この結果はあなたの支持率に反映されます。</p>
          <button onClick={handleEndGame} className="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-md transition">
            確認
          </button>
        </div>
      );
    }

    const currentIcon = interests.find(i => i.id === currentTarget)?.icon || '?';
    
    let feedbackClass = '';
    if (feedback === 'correct') feedbackClass = 'border-green-400 animate-pulse-once';
    if (feedback === 'incorrect') feedbackClass = 'border-red-400 animate-pulse-once';

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg">スコア: <span className="font-bold text-yellow-300">{score}</span></p>
                <p className="text-lg">残り時間: <span className="font-bold text-yellow-300">{timeLeft}</span></p>
            </div>
            
            <div className="text-center my-8">
                <p className="text-slate-400 mb-2">聴衆の関心事:</p>
                <div className={`mx-auto w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center text-5xl border-4 transition-colors ${feedbackClass}`}>
                    {currentIcon}
                </div>
            </div>

            <p className="text-center text-slate-300 mb-4">対応する演説テーマを選べ！</p>
            <div className="grid grid-cols-2 gap-4">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => handlePlayerChoice(interest.id)}
                  className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="font-bold">{interest.label}</span>
                </button>
              ))}
            </div>
          </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700 animate-fade-in-scale-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">街頭演説</h2>
          {gamePhase !== 'result' && (
              <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl">&times;</button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SpeechMinigameModal;
