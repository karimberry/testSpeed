
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SpeedMeterProps {
  speed: number | null;
  maxSpeed: number;
  type: 'download' | 'upload';
}

const SpeedMeter = ({ speed, maxSpeed, type }: SpeedMeterProps) => {
  const rotation = speed ? Math.min((speed / maxSpeed) * 180, 180) : 0;
  const color = type === 'download' ? 'from-violet-500 to-indigo-600' : 'from-emerald-500 to-teal-600';
  const bgColor = type === 'download' ? 'from-violet-500/20 to-indigo-600/20' : 'from-emerald-500/20 to-teal-600/20';
  
  return (
    <div className="relative w-80 h-44 mx-auto mb-8">
      {/* Speedometer background */}
      <div className={cn(
        "absolute w-full h-full rounded-t-full bg-gradient-to-br",
        bgColor
      )} />
      
      {/* Speed marks and numbers */}
      <div className="absolute w-full h-full">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 18 - 90}deg)` }}>
            <div className={cn(
              "absolute top-0 left-1/2 h-4 w-1 transform -translate-x-1/2 origin-bottom",
              speed && (i * 10 <= (speed / maxSpeed) * 100)
                ? cn("bg-gradient-to-br", color)
                : "bg-gray-600"
            )} />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
              {(i * (maxSpeed / 10)).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Animated needle with smooth transition */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 w-1 h-36 rounded-full transition-transform duration-700 ease-elastic origin-bottom",
          "after:content-[''] after:absolute after:-top-1 after:-left-2 after:w-4 after:h-4 after:rounded-full",
          type === 'download' ? 'bg-violet-500 after:bg-violet-500' : 'bg-emerald-500 after:bg-emerald-500'
        )}
        style={{ transform: `translateX(-50%) rotate(${rotation - 90}deg)` }}
      />
      
      {/* Digital speed display */}
      <div className="absolute bottom-[-2.5rem] left-1/2 transform -translate-x-1/2 text-center">
        <div className={cn(
          "text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          color
        )}>
          {speed ? `${speed.toFixed(1)}` : '--'}
        </div>
        <div className="text-sm text-gray-400">Mbps</div>
      </div>
    </div>
  );
};

export default SpeedMeter;
