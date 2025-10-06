
import React, { useState, useCallback, useEffect, useMemo } from 'react';
// FIX: Corrected imports for types that will be exported from types.ts
import { GameState, GameStatus, Party, Minister } from './types';
import SetupScreen from './components/SetupScreen';
import MainGame from './components/MainGame';
import ElectionScreen from './components/ElectionScreen';
import MusicPlayer from './components/MusicPlayer';

const oppositionPartyPresets: Omit<Party, 'seats' | 'isPlayer' | 'support' | 'relation'>[] = [
  // 左派・社会主義・社会民主主義
  { partyName: '社会民主党', ideology: '社会民主主義' },
  { partyName: '労働党', ideology: '社会主義' },
  { partyName: '人民連合', ideology: '社会主義' },
  { partyName: '進歩労働党', ideology: '中道左派' },
  { partyName: '左翼戦線', ideology: '急進主義' },
  { partyName: '連帯', ideology: '社会主義' },
  { partyName: '新社会フォーラム', ideology: '社会主義' },
  { partyName: '民主労働者党', ideology: '社会主義' },
  { partyName: '人民戦線', ideology: '平等主義' },


  // リベラル・中道
  { partyName: '立憲民主党', ideology: 'リベラリズム' },
  { partyName: '社会自由党', ideology: '社会自由主義' },
  { partyName: '中道連合', ideology: '中道' },
  { partyName: '改革党', ideology: '進歩主義' },
  { partyName: '市民フォーラム', ideology: 'リベラリズム' },
  { partyName: '進歩同盟', ideology: '進歩主義' },
  { partyName: '新党みらい', ideology: '進歩主義' },
  { partyName: '民主改革連合', ideology: '中道左派' },
  { partyName: 'ヒューマニスト党', ideology: '社会自由主義' },


  // 保守・右派
  { partyName: '国民保守党', ideology: '保守主義' },
  { partyName: '自由連合', ideology: '中道保守' },
  { partyName: '共和党', ideology: '共和主義' },
  { partyName: '伝統と秩序', ideology: '伝統保守' },
  { partyName: '国家党', ideology: '国粋主義' },
  { partyName: '愛国者同盟', ideology: '国粋主義' },
  { partyName: '国民戦線', ideology: '国粋主義' },
  { partyName: '保守改革連合', ideology: '中道保守' },
  { partyName: '主権党', ideology: '反グローバリズム' },
  { partyName: 'キリスト教民主連合', ideology: '伝統保守' },

  // 経済右派・リバタリアン
  { partyName: '自由経済党', ideology: '新自由主義' },
  { partyName: 'リバタリアン党', ideology: 'リバタリアニズム' },
  { partyName: '減税連合', ideology: 'リバタリアニズム' },
  { partyName: '新自由フォーラム', ideology: '新自由主義' },
  { partyName: '改革フォーラム', ideology: '新自由主義' },

  // 環境主義
  { partyName: '緑の党', ideology: '環境主義' },
  { partyName: 'エコロジスト連合', ideology: '環境主義' },
  { partyName: '環境市民ネットワーク', ideology: '環境主義' },

  // その他のイデオロギー
  { partyName: '農民同盟', ideology: '農本主義' },
  { partyName: '地域連合', ideology: '地域主義' },
  { partyName: 'テクノクラート党', ideology: '技術主義' },
  { partyName: '未来党', ideology: '技術主義' },
  { partyName: '人民の力', ideology: 'ポピュリズム' },
  { partyName: '平和党', ideology: '平和主義' },
  { partyName: '都市ネットワーク', ideology: '都市主義' },
  { partyName: '公正党', ideology: '平等主義' },
  { partyName: '海賊党', ideology: 'リバタリアニズム' },
];


// Fisher-Yates shuffle algorithm
// Fix: Changed to a standard function declaration to avoid JSX parsing ambiguity with generics in an arrow function.
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const ideologyGroups: Record<string, string[]> = {
  conservative: ['保守主義', '伝統保守', '中道保守', '国粋主義', '共和主義', '農本主義', '反グローバリズム'],
  liberal_left: ['リベラリズム', '社会主義', '社会民主主義', '中道左派', '進歩主義', '平等主義', '社会自由主義', '平和主義', '環境主義'],
  economic_right: ['新自由主義', 'リバタリアニズム'],
  technocratic: ['技術主義', '都市主義'],
  populist: ['ポピュリズム', '地域主義'],
  radical: ['急進主義'],
  centrist: ['中道'],
};

const ideologyToGroup: Record<string, string> = {};
Object.keys(ideologyGroups).forEach(group => {
  ideologyGroups[group].forEach(ideology => {
    ideologyToGroup[ideology] = group;
  });
});

const calculateInitialRelation = (playerIdeology: string, targetIdeology: string): number => {
    const playerGroup = ideologyToGroup[playerIdeology] || 'other';
    const targetGroup = ideologyToGroup[targetIdeology] || 'other';

    if (playerGroup === 'other' || targetGroup === 'other' || playerGroup === 'centrist' || targetGroup === 'centrist') {
        return 45 + Math.floor(Math.random() * 11); // 45-55
    }
    if (playerGroup === targetGroup) {
        return 60 + Math.floor(Math.random() * 11); // 60-70
    }
    if (
        (playerGroup === 'conservative' && targetGroup === 'liberal_left') || (playerGroup === 'liberal_left' && targetGroup === 'conservative') ||
        (playerGroup === 'economic_right' && targetGroup === 'liberal_left') || (playerGroup === 'liberal_left' && targetGroup === 'economic_right') ||
        (playerGroup === 'conservative' && targetGroup === 'radical') || (playerGroup === 'radical' && targetGroup === 'conservative')
    ) {
        return 25 + Math.floor(Math.random() * 11); // 25-35
    }
    return 40 + Math.floor(Math.random() * 11); // 40-50
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  const uniqueIdeologies = useMemo(() => {
    const ideologies = oppositionPartyPresets.map(p => p.ideology);
    return ['中道', ...[...new Set(ideologies)].sort()];
  }, []);

  const handleGameStart = useCallback(async (countryName: string, partyName: string, flagDataUrl: string | null, ideology: string) => {
    setLoading(true);
    try {
      // API呼び出しの代わりに静的リストからランダムに選択
      const otherParties = shuffleArray(oppositionPartyPresets).slice(0, 4);
      
      const totalSeats = 100;
      const playerSeats = 40;
      let remainingSeats = totalSeats - playerSeats;

      const partiesWithSeats: Party[] = otherParties.map((party, index) => {
        let seats = Math.floor(remainingSeats / (otherParties.length - index));
        if (index === otherParties.length - 1) {
            seats = remainingSeats;
        }
        remainingSeats -= seats;
        return { 
            ...party, 
            seats, 
            support: seats,
            relation: calculateInitialRelation(ideology, party.ideology)
        };
      });

      const playerParty: Party = {
        partyName: partyName,
        ideology: ideology,
        isPlayer: true,
        seats: playerSeats,
        support: 40,
        relation: 100,
      };

      const allParties = [playerParty, ...partiesWithSeats];

      setGameState({
        status: GameStatus.Playing,
        turn: 1,
        player: {},
        country: {
          name: countryName,
          flag: flagDataUrl,
          treasury: 10000,
          factions: [
            { name: '富裕層', happiness: 60, populationShare: 10 },
            { name: '中間層', happiness: 70, populationShare: 40 },
            { name: '貧困層', happiness: 50, populationShare: 20 },
            { name: '資本家', happiness: 65, populationShare: 5 },
            { name: '労働者', happiness: 55, populationShare: 25 },
          ],
          manpower: 5000,
          researchPoints: 100,
          militaryPower: 1000,
          corruption: 0,
          // FIX: Initialize stability
          stability: 60,
        },
        playerStats: {
          partyFunds: 0,
          politicalPower: 50,
        },
        parties: allParties,
        logs: [`${countryName}の歴史が始まる...`],
        newsArticles: [{ 
            outletName: '中立タイムズ', 
            politicalLeaning: 'neutral', 
            headline: '新政権発足', 
            body: `本日、${partyName}を第一党とする新政権が発足した。国民は新政府の手腕に期待と不安が入り混じった視線を送っている。` 
        }],
        billToVoteOn: null,
        activeEvent: null,
        playerStatus: 'ruling',
        civilWarState: null,
        warState: null,
        budget: {
          tax: 'normal',
          education: 'normal',
          welfare: 'normal',
          defense: 'normal',
        },
        militaryFrustration: 0,
        electionState: null,
        voteResult: null,
        diplomaticPacts: [],
        playerCoalition: [],
        oppositionCoalitions: [],
        ministers: [],
      });
    } catch (error) {
      console.error("ゲームの初期化に失敗しました:", error);
      alert("ゲームの初期化に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleElectionEnd = useCallback((newParties: Party[]) => {
    setGameState(prev => {
      if (!prev) return null;
      
      const newRulingParty = newParties.reduce((max, p) => p.seats > max.seats ? p : max, newParties[0]);
      const playerIsNowRuling = newRulingParty.isPlayer || false;
      const newPlayerStatus = playerIsNowRuling ? 'ruling' : 'opposition';

      let newLogs = [...prev.logs, `第${Math.ceil(prev.turn / 10)}回総選挙が終了しました。`];
      
      if (prev.playerStatus !== newPlayerStatus) {
          if (newPlayerStatus === 'ruling') {
              newLogs.push(`[政権交代] 選挙に勝利し、${newRulingParty.partyName}が与党となりました！`);
          } else {
              newLogs.push(`[政権交代] 選挙の結果、${newRulingParty.partyName}が第一党となり、あなたは野党になりました。`);
          }
      } else {
          newLogs.push(`[選挙結果] ${newRulingParty.partyName}が引き続き政権を維持します。`);
      }

      // Recalculate relations based on new political landscape after election
      const playerPartyAfterElection = newParties.find(p => p.isPlayer);
      if (!playerPartyAfterElection) return prev; // Should not happen

      const updatedParties = newParties.map(p => {
        if (p.isPlayer) return { ...p, relation: 100 };
        return { ...p, relation: calculateInitialRelation(playerPartyAfterElection.ideology, p.ideology) };
      });

      return {
        ...prev,
        status: GameStatus.Playing,
        parties: updatedParties,
        turn: prev.turn + 1,
        logs: newLogs,
        electionState: null,
        playerCoalition: [], // Coalitions are dissolved after elections
        oppositionCoalitions: [],
        playerStatus: newPlayerStatus,
      };
    });
  }, []);

  useEffect(() => {
    if (gameState && gameState.turn > 1 && gameState.turn % 10 === 0 && gameState.status === GameStatus.Playing) {
        setGameState(prev => prev ? {
            ...prev,
            status: GameStatus.Election,
            electionState: { campaignTurn: 1 }
        } : null);
    }
  }, [gameState]);

  const renderContent = () => {
    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg">ゲームを生成中...</p>
            </div>
          </div>
        );
      }

      if (!gameState) {
        return <SetupScreen onGameStart={handleGameStart} ideologies={uniqueIdeologies} />;
      }
    
      if (gameState.status === GameStatus.Election) {
        return <ElectionScreen gameState={gameState} setGameState={setGameState} onElectionEnd={handleElectionEnd} />;
      }
      
      return <MainGame gameState={gameState} setGameState={setGameState} oppositionPartyPresets={oppositionPartyPresets} />;
  }


  return (
    <div className="min-h-screen w-full">
        <div className="animate-fade-in">
            {renderContent()}
        </div>
        <MusicPlayer />
    </div>
  );
};

export default App;
