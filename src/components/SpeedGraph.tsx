
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SpeedPoint {
  time: number;
  speed: number;
}

interface SpeedGraphProps {
  data: SpeedPoint[];
  type: 'download' | 'upload';
}

const SpeedGraph = ({ data, type }: SpeedGraphProps) => {
  const color = type === 'download' ? '#8b5cf6' : '#10b981';
  
  return (
    <div className="h-32 w-full mt-8 bg-gray-900/30 rounded-xl p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`colorSpeed-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="#666"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(0)}`}
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke={color}
            strokeWidth={2}
            fill={`url(#colorSpeed-${type})`}
            isAnimationActive={true}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedGraph;
