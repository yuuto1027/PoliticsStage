import React, { useState, useEffect, useRef } from 'react';
import playSound from '../services/audioService';

interface DonationMinigameModalProps {
  onClose: () => void;
  onResult: (amount: number) => void;
}

const DonationMinigameModal: React.FC<DonationMinigameModalProps> = ({ onClose, onResult }) => {
  const [markerPosition, setMarkerPosition] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<{ message: string, amount: number } | null>(null);
  
  const directionRef = useRef(1);
  const speedRef = useRef(1.5);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setMarkerPosition(prev => {
        let newPos = prev + speedRef.current * directionRef.current;
        if (newPos > 100 || newPos < 0) {
          directionRef.current *= -1;
          newPos = prev + speedRef.current * directionRef.current;
        }
        return newPos;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    if (gameStarted && !gameOver) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver]);


  const handleStart = () => {
    playSound('action');
    setGameStarted(true);
  };

  const handleStop = () => {
    if (!gameStarted || gameOver) return;

    setGameOver(true);

    let amount = 0;
    let message = '';

    if (markerPosition >= 45 && markerPosition <= 55) {
      amount = 2500 + Math.floor(Math.random() * 1001); // 2500-3500
      message = `交渉大成功！ ${amount.toLocaleString()} の献金を得た！`;
      playSound('success');
    } else if (markerPosition >= 30 && markerPosition <= 70) {
      amount = 1000 + Math.floor(Math.random() * 1001); // 1000-2000
      message = `交渉成功！ ${amount.toLocaleString()} の献金を得た。`;
      playSound('success');
    } else {
      amount = 0;
      message = '交渉は決裂した...献金は得られなかった。';
      playSound('failure');
    }
    setResult({ amount, message });
  };
  
  const handleClose = () => {
    onResult(result?.amount ?? 0);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-700 animate-fade-in-scale-up">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">献金交渉</h2>
        <p className="text-slate-300 mb-6">タイミングを合わせてバーを止め、高額献金を引き出せ！中央に近いほど高額になります。</p>

        <div className="relative h-8 w-full bg-slate-700 rounded-lg mb-4 overflow-hidden">
            {/* Fail zones */}
            <div className="absolute h-full bg-red-800" style={{ left: '0%', width: '30%' }}></div>
            <div className="absolute h-full bg-red-800" style={{ left: '70%', width: '30%' }}></div>
            {/* Success zone */}
            <div className="absolute h-full bg-green-800" style={{ left: '30%', width: '40%' }}></div>
            {/* Great Success zone */}
            <div className="absolute h-full bg-yellow-600 border-x-2 border-yellow-300" style={{ left: '45%', width: '10%' }}></div>

            <div 
                className="absolute top-0 h-full w-1 bg-white shadow-lg"
                style={{ left: `${markerPosition}%` }}
            ></div>
        </div>
        
        <div className="text-center mt-6">
            {!gameStarted && (
                <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition">
                    交渉開始
                </button>
            )}
            {gameStarted && !gameOver && (
                <button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition animate-pulse">
                    ストップ！
                </button>
            )}
        </div>
        
        {result && (
            <div className="mt-6 text-center animate-fade-in">
                <p className="text-lg font-semibold">{result.message}</p>
                <button onClick={handleClose} className="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-md transition">
                    確認
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default DonationMinigameModal;