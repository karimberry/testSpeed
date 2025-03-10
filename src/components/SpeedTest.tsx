import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Upload, Wifi, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GaugeChart from 'react-gauge-chart';

const SpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [currentTest, setCurrentTest] = useState<'download' | 'upload' | 'ping' | null>(null);
  const { toast } = useToast();

  const calculateSpeed = async (type: 'download' | 'upload') => {
    const testFileSize = 5 * 1024 * 1024; // 5MB test file
    const iterations = 3; // Number of test iterations
    let totalSpeed = 0;

    try {
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        
        if (type === 'download') {
          const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${testFileSize}`, {
            cache: 'no-store'
          });
          const data = await response.arrayBuffer();
        } else {
          const testData = new Blob([new ArrayBuffer(testFileSize)]);
          await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: testData,
            cache: 'no-store'
          });
        }
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        const speedMbps = (testFileSize * 8) / (1024 * 1024 * duration); // Convert to Mbps
        totalSpeed += speedMbps;

        // Update the download speed dynamically
        if (type === 'download') {
          setDownloadSpeed(parseFloat(speedMbps.toFixed(2)));
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay for visualization
        }
      }

      const averageSpeed = totalSpeed / iterations;
      if (type === 'download') {
        setDownloadSpeed(parseFloat(averageSpeed.toFixed(2)));
      } else {
        setUploadSpeed(parseFloat(averageSpeed.toFixed(2)));
      }
    } catch (error) {
      console.error(`Error during ${type} speed test:`, error);
      toast({
        title: "Error",
        description: `Failed to complete ${type} speed test. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const calculatePing = async () => {
    try {
      const iterations = 5;
      let totalPing = 0;

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        await fetch('https://speed.cloudflare.com/__ping', {
          cache: 'no-store'
        });
        const endTime = performance.now();
        totalPing += (endTime - startTime);
      }

      setPing(Math.round(totalPing / iterations));
    } catch (error) {
      console.error('Error measuring ping:', error);
      setPing(null);
    }
  };

  const startTest = async () => {
    setTesting(true);
    setProgress(0);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    
    try {
      setCurrentTest('ping');
      await calculatePing();
      
      setCurrentTest('download');
      await calculateSpeed('download');
      
      setCurrentTest('upload');
      await calculateSpeed('upload');
      
      setCurrentTest(null);
    } catch (error) {
      console.error('Error during speed test:', error);
    }

    setTesting(false);
    setProgress(100);
  };

  useEffect(() => {
    if (testing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [testing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl p-8 backdrop-blur-lg bg-white/80 border border-violet-100 shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
            Internet Speed Test
          </h1>
          <p className="text-gray-600">Testing your connection speed</p>
        </div>

        <div className="relative mb-8">
          <Progress value={progress} className="h-3 bg-violet-100" />
          
          <div className="mt-8 grid grid-cols-3 gap-8">
            <div className="text-center">
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={30}
                arcsLength={[0.3, 0.7]}
                colors={['#4f46e5', '#e0e0e0']}
                percent={downloadSpeed ? downloadSpeed / 100 : 0}
                textColor="#4f46e5"
                style={{ width: '250px', height: '250px' }}
              />
              <p className="text-sm text-gray-600 mb-1">Download</p>
              <p className="text-2xl font-bold text-violet-600">
                {downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : '--'}
              </p>
            </div>

            <div className="text-center">
              <GaugeChart
                id="gauge-chart2"
                nrOfLevels={30}
                arcsLength={[0.3, 0.7]}
                colors={['#3b82f6', '#e0e0e0']}
                percent={uploadSpeed ? uploadSpeed / 100 : 0}
                textColor="#3b82f6"
                style={{ width: '250px', height: '250px' }}
              />
              <p className="text-sm text-gray-600 mb-1">Upload</p>
              <p className="text-2xl font-bold text-indigo-600">
                {uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : '--'}
              </p>
            </div>

            <div className={`text-center transition-all duration-300 ${currentTest === 'ping' ? 'scale-110' : ''}`}>
              <div className="flex items-center justify-center mb-2">
                {currentTest === 'ping' ? (
                  <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                ) : (
                  <Wifi className="w-8 h-8 text-violet-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">Ping</p>
              <p className="text-2xl font-bold text-violet-600">
                {ping ? `${ping} ms` : '--'}
              </p>
              {currentTest === 'ping' && (
                <p className="text-sm text-violet-500 animate-pulse">Calculating...</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={startTest}
            disabled={testing}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-2 rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Start Test'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SpeedTest;
