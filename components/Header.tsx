
import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Party, Country } from '../types';

interface HeaderProps {
  playerStats: PlayerStats;
  playerParty: Party | undefined;
  totalSeats: number;
  country: Country;
  turn: number;
}

// Fix: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const StatItem: React.FC<{ icon: React.ReactElement; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value && (typeof value === 'number' || typeof prevValue.current === 'number')) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 600);
            prevValue.current = value;
            return () => clearTimeout(timer);
        }
    }, [value]);
    
    return (
        <div className={`flex items-center space-x-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700 ${color} transition-all duration-300 ${isAnimating ? 'animate-pulse-once' : ''}`}>
        <div className="w-6 h-6">{icon}</div>
        <div className="text-sm">
            <span className="font-semibold">{label}</span>: <span className="font-bold">{value}</span>
        </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ playerStats, playerParty, totalSeats, country, turn }) => {
  const seatPercentage = playerParty ? ((playerParty.seats / totalSeats) * 100).toFixed(1) : 0;

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm shadow-md p-3 sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold flex items-center space-x-3">
          {country.flag && <img src={country.flag} alt={`${country.name}の国旗`} className="w-10 h-7 object-cover rounded-sm shadow-md" />}
          <span>{country.name} - <span className="text-blue-300">{turn}ターン</span></span>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-2 md:gap-4">
          <StatItem icon={<FundsIcon />} label="政党資金" value={playerStats.partyFunds.toLocaleString()} color="text-yellow-300" />
          <StatItem icon={<PowerIcon />} label="政治力" value={playerStats.politicalPower} color="text-purple-300" />
          <StatItem icon={<SupportIcon />} label="支持率" value={`${(playerParty?.support || 0).toFixed(1)}%`} color="text-green-300" />
          <StatItem icon={<SeatsIcon />} label="議席" value={`${playerParty?.seats || 0} (${seatPercentage}%)`} color="text-red-300" />
        </div>
      </div>
    </header>
  );
};

const FundsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  </svg>
);

const PowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5.5" />
  </svg>
);

const SeatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


export default Header;
