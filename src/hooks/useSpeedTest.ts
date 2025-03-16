
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface SpeedData {
  time: number;
  speed: number;
}

export const useSpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [currentTest, setCurrentTest] = useState<'download' | 'upload' | 'ping' | null>(null);
  const [speedData, setSpeedData] = useState<SpeedData[]>([]);
  const { toast } = useToast();

  const measureSpeed = async (size: number): Promise<number> => {
    const randomData = new Array(size).fill('x').join('');
    const blob = new Blob([randomData], { type: 'application/octet-stream' });
    const startTime = performance.now();
    
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: blob
    });
    
    if (!response.ok) {
      throw new Error('Network test failed');
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // Convert to seconds
    const bitsLoaded = size * 8;
    const speedBps = bitsLoaded / duration;
    const speedMbps = speedBps / (1024 * 1024);
    
    return speedMbps;
  };

  const calculatePing = async () => {
    try {
      const iterations = 5;
      let totalPing = 0;

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        const response = await fetch('https://httpbin.org/get', {
          cache: 'no-store'
        });
        if (!response.ok) throw new Error('Ping test failed');
        const endTime = performance.now();
        totalPing += (endTime - startTime);
      }

      setPing(Math.round(totalPing / iterations));
    } catch (error) {
      console.error('Error measuring ping:', error);
      toast({
        title: "Error",
        description: "Failed to measure ping. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startTest = async () => {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setSpeedData([]);

    try {
      // Measure ping
      setCurrentTest('ping');
      await calculatePing();

      // Measure download speed
      setCurrentTest('download');
      const sizes = [1024 * 256, 1024 * 512, 1024 * 1024]; // Increasing file sizes
      for (let size of sizes) {
        const speed = await measureSpeed(size);
        setDownloadSpeed(speed);
        setSpeedData(prev => [...prev, { time: prev.length, speed }]);
      }

      // Measure upload speed
      setCurrentTest('upload');
      setSpeedData([]); // Reset graph for upload test
      for (let size of sizes) {
        const speed = await measureSpeed(size);
        setUploadSpeed(speed);
        setSpeedData(prev => [...prev, { time: prev.length, speed }]);
      }

    } catch (error) {
      console.error('Speed test error:', error);
      toast({
        title: "Error",
        description: "Failed to complete speed test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
      setCurrentTest(null);
    }
  };

  return {
    testing,
    downloadSpeed,
    uploadSpeed,
    ping,
    currentTest,
    speedData,
    startTest,
  };
};
