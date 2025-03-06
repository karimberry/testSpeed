'use client';

import { useState, useEffect } from 'react';

const SpeedTest = () => {
  const [status, setStatus] = useState('idle'); // idle, testing, complete
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [error, setError] = useState(null);

  const testFiles = [
    'https://speed.cloudflare.com/__down',
    'https://speedtest.tokyo.linode.com/100MB-tokyo.bin',
    'https://speedtest.ftp.otenet.gr/files/test100MB.db'
  ];

  const measureSpeed = async (type) => {
    const fileSize = 25 * 1024 * 1024; // 25MB test file
    let totalSpeed = 0;
    let successfulTests = 0;

    for (const testUrl of testFiles) {
      try {
        const startTime = performance.now();
        const response = await fetch(testUrl, {
          method: type === 'upload' ? 'POST' : 'GET',
          body: type === 'upload' ? new Blob([new ArrayBuffer(fileSize)]) : undefined,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // in seconds
        const speed = (fileSize * 8) / (1024 * 1024 * duration); // Convert to Mbps
        
        totalSpeed += speed;
        successfulTests++;
      } catch (error) {
        console.warn(`Failed to measure speed using ${testUrl}:`, error);
        continue;
      }
    }

    if (successfulTests === 0) {
      throw new Error('All speed test endpoints failed');
    }

    return totalSpeed / successfulTests;
  };

  const measurePing = async () => {
    const pingHosts = [
      'wss://speed.cloudflare.com/__ping',
      'wss://speedtest.tokyo.linode.com/ping',
      'wss://speedtest.ftp.otenet.gr/ping'
    ];

    let totalPing = 0;
    let successfulPings = 0;

    for (const host of pingHosts) {
      try {
        const startTime = performance.now();
        const ws = new WebSocket(host);
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            ws.close();
            reject(new Error('WebSocket connection timeout'));
          }, 5000);

          ws.onopen = () => {
            clearTimeout(timeout);
            resolve();
          };

          ws.onerror = (error) => {
            clearTimeout(timeout);
            reject(error);
          };
        });

        const endTime = performance.now();
        totalPing += Math.round(endTime - startTime);
        successfulPings++;
      } catch (error) {
        console.warn(`Failed to measure ping using ${host}:`, error);
        continue;
      }
    }

    if (successfulPings === 0) {
      // Fallback to HTTP ping if WebSocket fails
      try {
        const startTime = performance.now();
        await fetch('https://www.google.com/favicon.ico');
        const endTime = performance.now();
        return Math.round(endTime - startTime);
      } catch (error) {
        console.warn('Fallback ping failed:', error);
        return 0; // Return 0 instead of throwing error
      }
    }

    return Math.round(totalPing / successfulPings);
  };

  const startTest = async () => {
    setStatus('testing');
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setError(null);

    try {
      // Measure ping
      const pingResult = await measurePing();
      setPing(pingResult);

      // Measure download speed
      const downloadResult = await measureSpeed('download');
      setDownloadSpeed(downloadResult);

      // Measure upload speed
      const uploadResult = await measureSpeed('upload');
      setUploadSpeed(uploadResult);

      setStatus('complete');
    } catch (error) {
      console.error('Speed test failed:', error);
      setError('Failed to complete speed test. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Internet Speed Test</h1>
          <p className="text-gray-400 text-lg">Test your internet connection speed in seconds</p>
        </div>

        {status === 'idle' ? (
          <div className="flex flex-col items-center">
            <button
              onClick={startTest}
              className="group relative px-12 py-6 text-xl font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Start Speed Test</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Download Speed</h3>
                <p className="text-4xl font-bold text-green-400">
                  {downloadSpeed.toFixed(2)} <span className="text-lg">Mbps</span>
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Upload Speed</h3>
                <p className="text-4xl font-bold text-blue-400">
                  {uploadSpeed.toFixed(2)} <span className="text-lg">Mbps</span>
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Ping</h3>
                <p className="text-4xl font-bold text-purple-400">
                  {ping} <span className="text-lg">ms</span>
                </p>
              </div>
            </div>

            {status === 'testing' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg">Measuring your internet speed...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center">
                {error}
              </div>
            )}

            <button
              onClick={startTest}
              disabled={status === 'testing'}
              className={`w-full mt-8 py-4 px-6 rounded-xl text-lg font-semibold transition-all
                ${status === 'testing'
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {status === 'testing' ? 'Testing...' : 'Run Test Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedTest; 