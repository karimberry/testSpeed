import React from 'react';
import { Download, Upload, Wifi, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SpeedMeter from './SpeedMeter';
import SpeedGraph from './SpeedGraph';
import { SpeedData } from '@/hooks/useSpeedTest';

interface SpeedTestResultsProps {
  currentTest: 'download' | 'upload' | 'ping' | null;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  speedData: SpeedData[];
}

const SpeedTestResults = ({
  currentTest,
  downloadSpeed,
  uploadSpeed,
  ping,
  speedData,
}: SpeedTestResultsProps) => {
  const maxSpeed = 100;

  return (
    <div className="space-y-8">
      <div className="relative">
        {currentTest === 'download' && (
          <div className="animate-fade-in transition-all duration-500">
            <SpeedMeter
              speed={downloadSpeed}
              maxSpeed={maxSpeed}
              type="download"
            />
            <SpeedGraph data={speedData} type="download" />
          </div>
        )}
        
        {currentTest === 'upload' && (
          <div className="animate-fade-in transition-all duration-500">
            <SpeedMeter
              speed={uploadSpeed}
              maxSpeed={maxSpeed}
              type="upload"
            />
            <SpeedGraph data={speedData} type="upload" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 bg-gray-900/50 p-6 rounded-xl">
        <div className={cn(
          "text-center transition-all duration-300",
          currentTest === 'download' ? 'scale-110' : ''
        )}>
          <div className="flex items-center justify-center mb-2">
            {currentTest === 'download' ? (
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            ) : (
              <Download className="w-8 h-8 text-violet-500" />
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">Download</p>
          <p className="text-2xl font-bold text-violet-500">
            {downloadSpeed ? `${downloadSpeed.toFixed(1)} Mbps` : '--'}
          </p>
        </div>

        <div className={cn(
          "text-center transition-all duration-300",
          currentTest === 'upload' ? 'scale-110' : ''
        )}>
          <div className="flex items-center justify-center mb-2">
            {currentTest === 'upload' ? (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-emerald-500" />
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">Upload</p>
          <p className="text-2xl font-bold text-emerald-500">
            {uploadSpeed ? `${uploadSpeed.toFixed(1)} Mbps` : '--'}
          </p>
        </div>

        <div className={cn(
          "text-center transition-all duration-300",
          currentTest === 'ping' ? 'scale-110' : ''
        )}>
          <div className="flex items-center justify-center mb-2">
            {currentTest === 'ping' ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Wifi className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">Ping</p>
          <p className="text-2xl font-bold text-blue-500">
            {ping ? `${ping} ms` : '--'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeedTestResults;
