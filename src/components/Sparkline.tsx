import React from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number | string;
  height?: number;
  showGradient?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  width = 96,
  height = 32,
  showGradient = true,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return <div className="w-24 h-8 bg-gray-100 rounded" />;
  }

  const strokeColor = isPositive ? '#089981' : '#F23645';
  const gradientId = `sparkline-grad-${Math.random().toString(36).substring(2, 9)}`;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Build SVG path
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    // Invert y since SVG 0 is at the top
    const normalizedY = (val - min) / range;
    const y = isPositive 
      ? height - paddingY - (normalizedY * usableHeight)
      : paddingY + (normalizedY * usableHeight);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L 100,${height} L 0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      style={{ width, height }}
      preserveAspectRatio="none"
      className={`inline-block overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {showGradient && (
        <path
          d={areaD}
          fill={`url(#${gradientId})`}
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
      )}

      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
