import React, { useState, useEffect, useMemo } from 'react';
import playSound from '../services/audioService';

interface DebateMinigameModalProps {
  onClose: () => void;
  onResult: (result: { playerSupportChange: number; targetSupportChange: number; resultText: string }) => void;
  opponentName: string;
}

type ArgumentType = 'logic' | 'emotion' | 'data';

const debateTopics = [
  { topic: '経済政策', opponentArg: '「我々の減税案こそが、経済を活性化させる唯一の道だ！」' },
  { topic: '環境問題', opponentArg: '「環境保護は重要だが、行き過ぎた規制は経済を停滞させるだけだ！」' },
  { topic: '安全保障', opponentArg: '「対話だけでは国は守れない。今こそ防衛力の大幅な増強が必要だ！」' },
  { topic: '社会福祉', opponentArg: '「手厚い福祉は国民を怠惰にする。自己責任こそが社会を強くするのだ！」' },
  { topic: '教育改革', opponentArg: '「若者への投資こそ未来への投資だ。教育予算を倍増させるべきだ！」' },
];

const argumentTypes: { [key in ArgumentType]: { name: string, beats: ArgumentType, losesTo: ArgumentType } } = {
  logic: { name: '論理', beats: 'emotion', losesTo: 'data' },
  emotion: { name: '感情', beats: 'data', losesTo: 'logic' },
  data: { name: 'データ', beats: 'logic', losesTo: 'emotion' },
};

const DebateMinigameModal: React.FC<DebateMinigameModalProps> = ({ onClose, onResult, opponentName }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [playerChoice, setPlayerChoice] = useState<ArgumentType | null>(null);
  const [resultText, setResultText] = useState('');

  const { topic, opponentArg, opponentChoice } = useMemo(() => {
    const selectedTopic = debateTopics[Math.floor(Math.random() * debateTopics.length)];
    const choices: ArgumentType[] = ['logic', 'emotion', 'data'];
    const selectedOpponentChoice = choices[Math.floor(Math.random() * choices.length)];
    return { ...selectedTopic, opponentChoice: selectedOpponentChoice };
  }, []);

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    if (timeLeft <= 0) {
      handlePlayerChoice(null); // Timeout
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gamePhase]);

  const handlePlayerChoice = (choice: ArgumentType | null) => {
    if (gamePhase !== 'playing') return;

    setGamePhase('result');
    setPlayerChoice(choice);

    let playerSupportChange = 0;
    let targetSupportChange = 0;
    let text = '';

    if (!choice) {
      // Timeout
      playerSupportChange = -1.5;
      targetSupportChange = 0.5;
      text = '時間切れ！相手に主導権を握られてしまった...';
      playSound('failure');
    } else if (argumentTypes[choice].beats === opponentChoice) {
      // Win
      playerSupportChange = 2.0 + Math.random() * 1.5; // 2.0 - 3.5
      targetSupportChange = -1.0 - Math.random() * 1.0; // -1.0 - -2.0
      text = `会心の一撃！${opponentName}の主張を論破した！`;
      playSound('success');
    } else if (argumentTypes[choice].losesTo === opponentChoice) {
      // Lose
      playerSupportChange = -1.0 - Math.random() * 1.0;
      targetSupportChange = 1.5 + Math.random() * 1.0;
      text = `反論失敗...${opponentName}のペースで議論が進んでしまった。`;
      playSound('failure');
    } else {
      // Draw
      playerSupportChange = 0.5 + Math.random() * 0.5;
      targetSupportChange = -0.5 - Math.random() * 0.5;
      text = '議論は平行線。しかし、わずかに好印象を与えたようだ。';
      playSound('action');
    }
    
    setResultText(text);

    setTimeout(() => {
      onResult({ playerSupportChange, targetSupportChange, resultText: text });
    }, 2500);
  };

  const renderContent = () => {
    if (gamePhase === 'result') {
      return (
        <div className="text-center animate-fade-in">
          <p className="text-lg font-semibold">{resultText}</p>
          <p className="mt-4 text-sm text-slate-400">選挙活動画面に戻ります...</p>
        </div>
      );
    }

    return (
      <>
        <p className="text-sm text-slate-400 mb-2">テーマ: <span className="font-bold text-slate-200">{topic}</span></p>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
          <p className="font-bold text-red-400">{opponentName}の主張:</p>
          <p className="text-lg text-slate-200">"{opponentArg}"</p>
        </div>

        {gamePhase === 'intro' ? (
          <div className="text-center">
            <button
              onClick={() => { playSound('click'); setGamePhase('playing'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition"
            >
              討論開始
            </button>
          </div>
        ) : (
          <div>
            <div className="relative h-4 w-full bg-slate-700 rounded-full mb-4 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-1000 linear"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
            <p className="text-center text-slate-300 mb-4">どう反論する？</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handlePlayerChoice('logic')}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-transform transform hover:scale-105"
              >
                <p className="font-bold text-lg">論理で反論</p>
                <p className="text-xs text-blue-200">(感情論に強い)</p>
              </button>
              <button
                onClick={() => handlePlayerChoice('emotion')}
                className="bg-red-600 hover:bg-red-700 p-4 rounded-lg transition-transform transform hover:scale-105"
              >
                <p className="font-bold text-lg">感情に訴える</p>
                <p className="text-xs text-red-200">(データに強い)</p>
              </button>
              <button
                onClick={() => handlePlayerChoice('data')}
                className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-transform transform hover:scale-105"
              >
                <p className="font-bold text-lg">データを示す</p>
                <p className="text-xs text-green-200">(論理に強い)</p>
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 animate-fade-in-scale-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-300">政策討論会</h2>
          {gamePhase !== 'result' && (
              <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl">&times;</button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DebateMinigameModal;