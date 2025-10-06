import React, { useState, useEffect, useRef } from 'react';
import { Country, Faction } from '../types';

interface FooterProps {
  country: Country;
}

const StatItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 600);
            prevValue.current = value;
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className={`text-center transition-all duration-300 ${isAnimating ? 'animate-pulse-once' : ''}`}>
            <div className="text-sm text-slate-400">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
};

const calculateOverallStability = (factions: Faction[]): number => {
    if (!factions || factions.length === 0) return 50;
    const totalHappiness = factions.reduce((acc, faction) => {
        return acc + faction.happiness * (faction.populationShare / 100);
    }, 0);
    return Math.round(totalHappiness);
};


const Footer: React.FC<FooterProps> = ({ country }) => {
  const overallStability = calculateOverallStability(country.factions);
  return (
    <footer className="bg-slate-800/80 backdrop-blur-sm shadow-md p-4 sticky bottom-0 z-10 border-t border-slate-700">
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <StatItem label="国庫" value={country.treasury.toLocaleString()} />
        <StatItem label="社会安定" value={`${overallStability}%`} />
        <StatItem label="人的資源" value={country.manpower.toLocaleString()} />
        <StatItem label="研究ポイント" value={country.researchPoints} />
        <StatItem label="軍事力" value={country.militaryPower.toLocaleString()} />
        <StatItem label="腐敗度" value={`${country.corruption}`} />
      </div>
    </footer>
  );
};

export default Footer;