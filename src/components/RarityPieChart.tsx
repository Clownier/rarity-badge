import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { RARITIES } from '../constants';
import { t } from '../locales';

interface RarityPieChartProps {
  totalRarities: number[];
  language: 'zh' | 'en';
}

interface ChartSlice {
  name: string;
  value: number;
  color: string;
  total: number;
}

function CustomTooltip({ active, payload }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ChartSlice;
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
      <div>{d.value.toLocaleString()} ({(d.value / d.total * 100).toFixed(2)}%)</div>
    </div>
  );
}

export default function RarityPieChart({ totalRarities, language }: RarityPieChartProps) {
  const total = useMemo(() => totalRarities.reduce((a, b) => a + b, 0), [totalRarities]);

  const data = useMemo(() => {
    const items: { id: number; count: number }[] = totalRarities
      .map((count, i) => ({ id: i + 1, count }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count);

    if (items.length === 0) return [];

    const otherLabel = t('stats.chart-other', language);

    if (items.length <= 5) {
      return items.map(x => ({
        name: language === 'zh' ? RARITIES[x.id - 1].rarity : RARITIES[x.id - 1].rarityEn,
        value: x.count,
        color: RARITIES[x.id - 1].color,
        total,
      }));
    }

    const top5 = items.slice(0, 5);
    const otherCount = items.slice(5).reduce((s, x) => s + x.count, 0);

    return [
      ...top5.map(x => ({
        name: language === 'zh' ? RARITIES[x.id - 1].rarity : RARITIES[x.id - 1].rarityEn,
        value: x.count,
        color: RARITIES[x.id - 1].color,
        total,
      })),
      { name: otherLabel, value: otherCount, color: '#666666', total },
    ];
  }, [totalRarities, language, total]);

  if (data.length === 0) return null;

  return (
    <PieChart width={320} height={260}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        innerRadius={40}
        paddingAngle={2}
      >
        {data.map((entry, i) => (
          <Cell key={i} fill={entry.color} stroke="transparent" />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{ fontSize: '12px', color: '#ccc' }}
        formatter={(value: string) => (
          <span style={{ color: '#ccc', fontSize: '12px' }}>{value}</span>
        )}
      />
    </PieChart>
  );
}
