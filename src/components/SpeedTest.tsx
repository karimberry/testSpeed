
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SpeedTestResults from './SpeedTestResults';
import { useSpeedTest } from '@/hooks/useSpeedTest';

const SpeedTest = () => {
  const {
    testing,
    downloadSpeed,
    uploadSpeed,
    ping,
    currentTest,
    speedData,
    startTest,
  } = useSpeedTest();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl p-8 bg-gray-800/50 border-gray-700 shadow-xl rounded-2xl backdrop-blur-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Internet Speed Test
          </h1>
          <p className="text-gray-400">Test your connection speed</p>
        </div>

        {!testing && !downloadSpeed && !uploadSpeed ? (
          <div className="text-center mb-8">
            <Button
              onClick={startTest}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-6 rounded-full hover:opacity-90 transition-all duration-300 animate-pulse"
            >
              Start Test
            </Button>
          </div>
        ) : (
          <SpeedTestResults
            currentTest={currentTest}
            downloadSpeed={downloadSpeed}
            uploadSpeed={uploadSpeed}
            ping={ping}
            speedData={speedData}
          />
        )}
      </Card>
    </div>
  );
};

export default SpeedTest;
