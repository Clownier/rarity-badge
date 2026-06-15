import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { REGENRARITIES } from '../constants';

interface RegenBarChartProps {
  totalRegenRarities: number[];
  language: 'zh' | 'en';
}

function CustomTooltip({ active, payload }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#222',
      border: '1px solid #555',
      borderRadius: '4px',
      padding: '6px 10px',
      fontSize: '13px',
      color: '#e3e3e3',
    }}>
      <div>{d.name}</div>
      <div>Count: {d.count}</div>
    </div>
  );
}

export default function RegenBarChart({ totalRegenRarities, language }: RegenBarChartProps) {
  const data = useMemo(() =>
    totalRegenRarities.map((count, i) => {
      const regen = REGENRARITIES[i];
      return {
        name: language === 'zh' ? regen.rarity : regen.rarityEn,
        count,
        color: regen.color,
      };
    }),
    [totalRegenRarities, language],
  );

  return (
    <BarChart width={320} height={220} data={data}>
      <XAxis
        dataKey="name"
        tick={{ fill: '#ccc', fontSize: 10 }}
        axisLine={{ stroke: '#555' }}
        tickLine={false}
      />
      <YAxis
        tick={{ fill: '#888', fontSize: 11 }}
        axisLine={{ stroke: '#555' }}
        tickLine={false}
        allowDecimals={false}
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="count" radius={[3, 3, 0, 0]}>
        {data.map((entry, i) => (
          <Cell key={i} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  );
}
