import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Party } from '../types';
// FIX: Changed to a default import for playSound.
import playSound from '../services/audioService';
import DebateMinigameModal from './DebateMinigameModal';

interface ElectionScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  onElectionEnd: (newParties: Party[]) => void;
}

const CAMPAIGN_TURNS = 4;

type CampaignAction = 'speech' | 'debate' | 'negative_campaign' | 'grassroots' | 'counter_argument';

interface ActionDetails {
    name: string;
    description: string;
    cost: number;
}

const campaignActions: Record<CampaignAction, ActionDetails> = {
    speech: { name: '演説会', description: '大規模な演説会で支持を訴える。成功すれば大きな効果があるが、失敗のリスクも。', cost: 20 },
    debate: { name: '政策討論会', description: 'ライバル党首との討論会に臨む。ミニゲームの結果で支持率が変動する。', cost: 15 },
    negative_campaign: { name: 'ネガティブキャンペーン', description: 'ライバル党のスキャンダルを暴露する。相手の支持を大きく下げるが、自党の品位も問われる。', cost: 15 },
    grassroots: { name: '草の根運動', description: '地道な活動で着実に支持を固める。効果は小さいが、リスクはない。', cost: 10 },
    counter_argument: { name: '反論声明', description: '自身へのネガティブキャンペーンの効果を軽減し、相手に反撃する。', cost: 15 },
};

// Helper function to run one turn of opposition AI actions
const runOppositionCampaignTurn = (currentGameState: GameState): { updatedParties: Party[], logs: string[] } => {
    // Use a deep copy to ensure mutations don't affect other parts of the simulation unexpectedly
    const updatedParties: Party[] = JSON.parse(JSON.stringify(currentGameState.parties));
    const initialPartiesForDecision: Party[] = JSON.parse(JSON.stringify(currentGameState.parties));
    const logs: string[] = [];

    const oppositionParties = initialPartiesForDecision.filter(p => !p.isPlayer);

    oppositionParties.forEach(p => {
        if (Math.random() < 0.8) { // 80% chance to act
            const allOtherParties = initialPartiesForDecision.filter(op => op.partyName !== p.partyName);
            
            // AI Targeting Logic Revision: Target is not always the top party.
            const potentialTargets = allOtherParties.sort((a,b) => b.support - a.support).slice(0, 3);
            const mainTarget = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];


            let action: CampaignAction;
            const rand = Math.random();

            if (p.support < 20) { // Desperate
                action = rand < 0.5 ? 'speech' : 'negative_campaign';
            } else if (mainTarget && p.support > mainTarget.support) { // Leading
                action = 'grassroots';
            } else { // Contesting
                action = rand < 0.4 ? 'speech' : rand < 0.7 ? 'grassroots' : 'negative_campaign';
            }
            
            let logText = "";
            const partyToUpdate = updatedParties.find(up => up.partyName === p.partyName)!;

            switch(action) {
                case 'speech': {
                     const success = Math.random() < 0.6;
                     const change = success ? 1.0 + Math.random() * 2.5 : -(0.5 + Math.random() * 1.0);
                     partyToUpdate.support = Math.max(0, Math.min(100, partyToUpdate.support + change));
                     logText = `${p.partyName}が大規模演説会を実施。支持率が${change.toFixed(1)}%${change > 0 ? '上昇' : '低下'}。`;
                     break;
                }
                case 'negative_campaign': {
                    if (mainTarget) {
                        const targetPartyToUpdate = updatedParties.find(up => up.partyName === mainTarget.partyName);
                        if(targetPartyToUpdate) {
                            let temporaryLog = "";
                            // Balance adjustment: slightly weaker effect
                            let loss = 1.0 + Math.random() * 2.0; // 1.0 - 3.0
                            
                            // Check if player has counter-argument buff
                            const playerHasBuff = mainTarget.isPlayer && currentGameState.electionState?.playerBuffs?.counterArgumentTurns > 0;
                            if (playerHasBuff) {
                                loss *= 0.4; // Reduce effect by 60%
                                temporaryLog += ` ${p.partyName}の攻撃は、こちらの事前の反論によりあまり効果がなかったようだ。`;
                                
                                // Counter-attack effect
                                if (Math.random() < 0.5) {
                                    const counterLoss = 0.5 + Math.random() * 0.5;
                                    partyToUpdate.support = Math.max(0, partyToUpdate.support - counterLoss);
                                    temporaryLog += ` 逆に${p.partyName}の支持率が少し低下した！`;
                                }
                            }

                            targetPartyToUpdate.support = Math.max(0, targetPartyToUpdate.support - loss);
                            logText = `${p.partyName}が${mainTarget.partyName}へのネガティブキャンペーンを展開！相手の支持率が${loss.toFixed(1)}%低下。` + temporaryLog;
                             
                             // Balance adjustment: slightly higher backfire chance
                             if (Math.random() < 0.35) {
                                const selfLoss = 0.5 + Math.random();
                                partyToUpdate.support = Math.max(0, partyToUpdate.support - selfLoss);
                                logText += ` しかし、やり方が汚いと一部から反発も...`;
                            }
                        }
                    }
                    break;
                }
                case 'grassroots': {
                    const gain = 0.8 + Math.random() * 0.7;
                    partyToUpdate.support = Math.min(100, partyToUpdate.support + gain);
                    logText = `${p.partyName}が草の根運動を展開。支持率が${gain.toFixed(1)}%上昇。`;
                    break;
                }
            }
            if (logText) logs.push(logText);
        }
    });

    return { updatedParties, logs };
};


const ElectionScreen: React.FC<ElectionScreenProps> = ({ gameState, setGameState, onElectionEnd }) => {
  const [posts, setPosts] = useState<{ partyName: string; text: string; }[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [isDebateMinigameOpen, setIsDebateMinigameOpen] = useState(false);
  const [electionResult, setElectionResult] = useState<(Party & { seatChange: number })[] | null>(null);

  const addPost = useCallback((partyName: string, text: string) => {
    setPosts(prev => [{ partyName, text }, ...prev.slice(0, 15)]);
  }, []);

  const advanceCampaignTurn = useCallback(async () => {
    // 2. Opposition Actions AI
    setGameState(prev => {
        if (!prev) return null;
        const { updatedParties, logs } = runOppositionCampaignTurn(prev);
        logs.forEach(log => addPost('選挙管理委員会', log));
        return { ...prev, parties: updatedParties };
    });

    await new Promise(res => setTimeout(res, 1000));
    
    // 3. Advance Turn and decay buffs
    setGameState(prev => {
        if (!prev || !prev.electionState) return prev;
        const nextTurn = prev.electionState.campaignTurn + 1;
        const currentBuffs = prev.electionState.playerBuffs;
        let nextBuffs = undefined;

        if (currentBuffs && currentBuffs.counterArgumentTurns > 1) {
            nextBuffs = { counterArgumentTurns: currentBuffs.counterArgumentTurns - 1 };
        } else if (currentBuffs && currentBuffs.counterArgumentTurns === 1) {
            addPost('システム', '反論声明の効果が切れました。');
        }
        
        return {
            ...prev,
            electionState: { 
                ...prev.electionState, 
                campaignTurn: nextTurn,
                playerBuffs: nextBuffs,
            }
        };
    });
    setSelectedTarget(null);
    setActionInProgress(false);
  }, [setGameState, addPost]);

  const handleDebateResult = (result: { playerSupportChange: number, targetSupportChange: number, resultText: string }) => {
    setIsDebateMinigameOpen(false);
    
    setGameState(prev => {
        if (!prev) return null;

        const newParties = prev.parties.map(p => {
            if (p.isPlayer) {
                return { ...p, support: Math.max(0, Math.min(100, p.support + result.playerSupportChange)) };
            }
            if (p.partyName === selectedTarget) {
                return { ...p, support: Math.max(0, Math.min(100, p.support + result.targetSupportChange)) };
            }
            return p;
        });
        
        const playerParty = newParties.find(p => p.isPlayer)!;
        addPost(playerParty.partyName, `討論会の結果: ${result.resultText}`);

        return { ...prev, parties: newParties };
    });

    setTimeout(() => {
        advanceCampaignTurn();
    }, 1000);
  };


  const handlePlayerAction = async (action: CampaignAction) => {
    if (actionInProgress) return;
    
    const details = campaignActions[action];
    if (gameState.playerStats.politicalPower < details.cost) {
      playSound('failure');
      addPost('システム', `政治力が足りません！ (必要: ${details.cost})`);
      return;
    }
    if ((action === 'debate' || action === 'negative_campaign') && !selectedTarget) {
      playSound('failure');
      addPost('システム', 'ターゲットを選択してください！');
      return;
    }

    playSound('click');
    setActionInProgress(true);
    
    // 1. Player Action
    setGameState(prev => {
        if (!prev) return null;
        return { 
            ...prev,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - details.cost
            }
        };
    });

    if (action === 'debate') {
        setIsDebateMinigameOpen(true);
        return;
    }

    if (action === 'counter_argument') {
        setGameState(prev => {
            if (!prev || !prev.electionState) return prev;
            addPost(prev.parties.find(p=>p.isPlayer)!.partyName, 'メディアを通じて、自身への誹謗中傷に対する反論声明を発表した。');
            playSound('action');
            return {
                ...prev,
                electionState: {
                    ...prev.electionState,
                    playerBuffs: { counterArgumentTurns: 2 } // Effective for this turn and the next
                }
            };
        });
        await new Promise(res => setTimeout(res, 1000));
        advanceCampaignTurn();
        return;
    }

    setGameState(prev => {
        if (!prev) return null;
        
        let newParties = [...prev.parties];
        const playerParty = newParties.find(p => p.isPlayer)!;
        let logText = '';

        switch (action) {
            case 'speech': {
                const success = Math.random() < 0.75; // 75% success
                if (success) {
                    const gain = 1.0 + Math.random() * 3.0; // 1.0 - 4.0
                    playerParty.support = Math.min(100, playerParty.support + gain);
                    logText = `演説会は成功を収め、支持率が${gain.toFixed(1)}%上昇した！`;
                    playSound('success');
                } else {
                    const loss = 0.5 + Math.random() * 1.0; // 0.5 - 1.5
                    playerParty.support = Math.max(0, playerParty.support - loss);
                    logText = `演説会で失言... 支持率が${loss.toFixed(1)}%低下した。`;
                    playSound('failure');
                }
                break;
            }
            case 'negative_campaign': {
                const targetParty = newParties.find(p => p.partyName === selectedTarget)!;
                const loss = 2.0 + Math.random() * 3.0; // 2.0 - 5.0
                targetParty.support = Math.max(0, targetParty.support - loss);
                logText = `${targetParty.partyName}へのネガティブキャンペーンが成功し、相手の支持率を${loss.toFixed(1)}%低下させた。`;
                playSound('success');

                const backlash = Math.random() < 0.3; // 30% backlash
                if (backlash) {
                    const selfLoss = 1.0 + Math.random() * 1.0; // 1.0 - 2.0
                    playerParty.support = Math.max(0, playerParty.support - selfLoss);
                    logText += ` しかし、卑劣な戦術に有権者から反発の声も... (支持率-${selfLoss.toFixed(1)}%)`;
                    playSound('failure');
                }
                break;
            }
            case 'grassroots': {
                const gain = 1.0 + Math.random() * 0.5; // 1.0 - 1.5
                playerParty.support = Math.min(100, playerParty.support + gain);
                logText = `草の根運動により、支持率が${gain.toFixed(1)}%着実に上昇した。`;
                playSound('success');
                break;
            }
        }
        addPost(playerParty.partyName, logText);
        
        return { ...prev, parties: newParties };
    });
    
    await new Promise(res => setTimeout(res, 1000));
    
    advanceCampaignTurn();
  };
  
  const handleSkipTurn = () => {
    if(actionInProgress) return;
    playSound('next_turn');
    setActionInProgress(true);
    addPost('システム', '選挙活動を1日スキップします。');
    
    // 野党のAIターンを実行し、ターンを進める
    advanceCampaignTurn();
  };

  useEffect(() => {
    if (gameState.electionState && gameState.electionState.campaignTurn > CAMPAIGN_TURNS && !electionResult) {
      // Election ends, calculate results
      let totalSupport = gameState.parties.reduce((sum, p) => sum + p.support, 0);
      if (totalSupport === 0) totalSupport = 1; // Avoid division by zero
      const totalSeats = 100;
      
      const partiesWithSeats = gameState.parties.map(p => ({
          ...p,
          exactSeats: (p.support / totalSupport) * totalSeats,
          seats: Math.floor((p.support / totalSupport) * totalSeats),
      }));

      let currentTotalSeats = partiesWithSeats.reduce((sum, p) => sum + p.seats, 0);
      let remainingSeats = totalSeats - currentTotalSeats;

      // Distribute remaining seats based on the fractional part, largest remainder method
      partiesWithSeats.sort((a, b) => (b.exactSeats - b.seats) - (a.exactSeats - a.seats));
      
      for(let i = 0; i < remainingSeats; i++) {
          partiesWithSeats[i].seats++;
      }
      
      const finalParties = partiesWithSeats.map(({exactSeats, ...p}) => {
          const originalParty = gameState.parties.find(op => op.partyName === p.partyName);
          const seatChange = p.seats - (originalParty?.seats || 0);
          return { ...p, seatChange };
      });

      playSound('success');
      setElectionResult(finalParties);
    }
  }, [gameState, electionResult]);

  if (!gameState.electionState) {
    return <div>選挙情報を読み込み中...</div>;
  }
  
  if (electionResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4">
        <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl border border-slate-700 animate-fade-in-scale-up">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-300">選挙結果</h1>
          <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
            {electionResult.sort((a, b) => b.seats - a.seats).map(p => {
              const seatChangeText = p.seatChange > 0 ? `+${p.seatChange}` : p.seatChange < 0 ? `${p.seatChange}` : `-`;
              const seatChangeColor = p.seatChange > 0 ? 'text-green-400' : p.seatChange < 0 ? 'text-red-400' : 'text-slate-400';
              return (
                <div key={p.partyName} className={`flex justify-between items-center p-2 rounded ${p.isPlayer ? 'bg-blue-900/50' : ''}`}>
                  <span className={`font-semibold ${p.isPlayer ? 'text-blue-300' : ''}`}>{p.partyName}</span>
                  <div className="flex items-center space-x-4">
                    <span className={`w-16 text-right font-mono ${seatChangeColor}`}>({seatChangeText})</span>
                    <span className="font-bold text-lg w-20 text-right">{p.seats} 議席</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => onElectionEnd(electionResult)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md transition duration-300"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    );
  }

  const oppositionParties = gameState.parties.filter(p => !p.isPlayer);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4">
      {isDebateMinigameOpen && selectedTarget && (
        <DebateMinigameModal
          onResult={handleDebateResult}
          opponentName={selectedTarget}
          onClose={() => setIsDebateMinigameOpen(false)}
        />
      )}
      <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-5xl border border-slate-700">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-300">総選挙</h1>
        <p className="text-center text-slate-400 mb-4">
          キャンペーン {gameState.electionState.campaignTurn} / {CAMPAIGN_TURNS}
          {gameState.electionState.playerBuffs?.counterArgumentTurns > 0 && 
            <span className="ml-4 text-green-400 animate-pulse">反論声明 効果発動中！</span>
          }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Party list */}
          <div className="md:col-span-1 bg-slate-900/50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-3">各党の支持率</h2>
            <ul className="space-y-3">
              {[...gameState.parties].sort((a,b) => b.support - a.support).map(p => (
                <li key={p.partyName}>
                  <p className={`font-semibold ${p.isPlayer ? 'text-blue-400' : ''}`}>{p.partyName}</p>
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${p.isPlayer ? 'bg-blue-500' : 'bg-slate-500'}`}
                      style={{ width: `${p.support}%`, transition: 'width 0.5s ease-in-out' }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-slate-300">{p.support.toFixed(1)}%</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions and Feed */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">選挙活動</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    {Object.entries(campaignActions).map(([key, details]) => (
                      <button
                        key={key}
                        onClick={() => handlePlayerAction(key as CampaignAction)}
                        disabled={actionInProgress}
                        className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={details.description}
                      >
                        <p className="font-bold">{details.name}</p>
                        <p className="text-xs text-slate-400">政治力: {details.cost}</p>
                      </button>
                    ))}
                  </div>
                   <div>
                    <button 
                      onClick={handleSkipTurn}
                      disabled={actionInProgress}
                      className="w-full mt-2 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      キャンペーン日をスキップ
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">討論会やネガティブキャンペーンのターゲットを選択:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {oppositionParties.map(p => (
                        <button
                          key={p.partyName}
                          onClick={() => setSelectedTarget(p.partyName)}
                          disabled={actionInProgress}
                          className={`p-2 rounded-lg text-sm border-2 transition-colors ${selectedTarget === p.partyName ? 'bg-blue-500 border-blue-300' : 'bg-slate-700 border-slate-600 hover:border-slate-500'}`}
                        >
                          {p.partyName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg h-64">
              <h2 className="text-xl font-bold mb-3">選挙速報</h2>
              <div className="h-full overflow-y-auto pr-2">
                <ul className="space-y-2 text-sm">
                  {posts.map((post, index) => (
                    <li key={index} className="p-2 bg-slate-800/50 rounded animate-fade-in">
                      <span className="font-bold text-cyan-400">{post.partyName}: </span>
                      <span className="text-slate-300">{post.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionScreen;