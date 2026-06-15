import { useCallback, useState } from 'react';
import type { RollResult } from '../types';
import { getRarityName } from '../lib/format';

interface RollStripProps {
  rolls: RollResult[];
  language: 'zh' | 'en';
}

export default function RollStrip({ rolls, language }: RollStripProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((i: number) => setHoverIndex(i), []);
  const handleMouseLeave = useCallback(() => setHoverIndex(null), []);

  return (
    <div style={{
      display: 'flex',
      gap: '3px',
      alignItems: 'center',
      position: 'relative',
      minHeight: '36px',
      flexWrap: 'wrap',
    }}>
      {rolls.map((roll, i) => (
        <div
          key={i}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: roll.color,
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0,
            border: i === rolls.length - 1 ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
            opacity: roll.id === 0 ? 0.3 : 1,
          }}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {hoverIndex === i && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '6px',
              padding: '4px 8px',
              background: '#222',
              border: '1px solid #555',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 10,
              pointerEvents: 'none',
              color: '#e3e3e3',
            }}>
              {getRarityName(roll.id, language)} - {roll.id > 0 ? `1/${roll.chance}` : ''}
              <span style={{ color: '#888', marginLeft: '4px' }}>#{i + 1}/{rolls.length}</span>
            </div>
          )}
        </div>
      ))}
      {rolls.length > 0 && (
        <span style={{
          fontSize: '18px',
          lineHeight: '28px',
          color: '#888',
          marginLeft: '2px',
        }} title="">
          ▶
        </span>
      )}
    </div>
  );
}
