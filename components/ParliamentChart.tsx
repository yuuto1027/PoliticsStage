import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Party } from '../types';

interface ParliamentChartProps {
  parties: Party[];
  playerPartyName: string;
  playerCoalition: string[];
}

const PLAYER_COLOR = '#3B82F6'; // Blue-500 (与党)
const COALITION_COLOR = '#60A5FA'; // Blue-400 (連立与党)
const OPPOSITION_COLORS = ['#FFBB28', '#00C49F', '#FF8042', '#AF19FF', '#FF1943']; // 野党

const ParliamentChart: React.FC<ParliamentChartProps> = ({ parties, playerPartyName, playerCoalition }) => {
  const chartData = useMemo(() => {
    let oppositionColorIndex = 0;
    // Sort parties to group ruling coalition together
    const sortedParties = [...parties].sort((a, b) => {
      const isAPlayer = a.partyName === playerPartyName;
      const isBPlayer = b.partyName === playerPartyName;
      const isACoalition = playerCoalition.includes(a.partyName);
      const isBCoalition = playerCoalition.includes(b.partyName);

      if (isAPlayer) return -1;
      if (isBPlayer) return 1;
      if (isACoalition && !isBCoalition) return -1;
      if (!isACoalition && isBCoalition) return 1;
      return 0; // Keep original order for opposition
    });

    return sortedParties.map(p => {
      let color;
      if (p.partyName === playerPartyName) {
        color = PLAYER_COLOR;
      } else if (playerCoalition.includes(p.partyName)) {
        color = COALITION_COLOR;
      } else {
        color = OPPOSITION_COLORS[oppositionColorIndex % OPPOSITION_COLORS.length];
        oppositionColorIndex++;
      }
      return {
        name: p.partyName,
        value: p.seats,
        fill: color,
      };
    });
  }, [parties, playerPartyName, playerCoalition]);

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            formatter={(value, entry: any) => {
              const { color, payload } = entry;
              return <span style={{ color: '#E5E7EB' }}>{payload.name} ({payload.value}議席)</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParliamentChart;