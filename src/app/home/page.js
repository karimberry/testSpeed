'use client';

import { useState } from 'react';

export default function SpeedTestUI() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const generateLargeBlob = (size) => {
        const array = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return new Blob([array]);
    };

    const measureSpeed = async (type) => {
        const testSize = 5 * 1024 * 1024; // 5MB test file
        const startTime = performance.now();
        
        try {
            if (type === 'download') {
                // Download test
                const response = await fetch('https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js');
                if (!response.ok) throw new Error('Download failed');
                const data = await response.blob();
                const actualSize = data.size;
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000; // in seconds
                return (actualSize * 8) / (1024 * 1024 * duration); // Convert to Mbps
            } else {
                // Upload test
                const testData = generateLargeBlob(testSize);
                const formData = new FormData();
                formData.append('file', testData);
                
                const uploadStartTime = performance.now();
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!uploadResponse.ok) throw new Error('Upload failed');
                const uploadEndTime = performance.now();
                const uploadDuration = (uploadEndTime - uploadStartTime) / 1000;
                return (testSize * 8) / (1024 * 1024 * uploadDuration); // Convert to Mbps
            }
        } catch (error) {
            console.error(`Error measuring ${type} speed:`, error);
            return 0;
        }
    };

    const measurePing = async () => {
        let totalPing = 0;
        const attempts = 3;

        for (let i = 0; i < attempts; i++) {
            const startTime = performance.now();
            try {
                await fetch('https://www.google.com/favicon.ico');
                const endTime = performance.now();
                totalPing += endTime - startTime;
            } catch (error) {
                console.error('Error measuring ping:', error);
                return 0;
            }
        }

        return Math.round(totalPing / attempts);
    };

    const startTest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Measure ping
            const ping = await measurePing();
            
            // Measure download speed
            const downloadSpeed = await measureSpeed('download');
            
            // Measure upload speed
            const uploadSpeed = await measureSpeed('upload');

            setResults({
                ping,
                downloadSpeed,
                uploadSpeed
            });
        } catch (error) {
            setError('Failed to complete speed test. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div style={{ backgroundColor: 'red', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Internet Speed Test</h1>
                
                {!results && !isLoading && (
                    <button 
                        onClick={startTest}
                        style={{ 
                            backgroundColor: 'red', 
                            border: "4px solid white", 
                            width: '200px', 
                            height: '200px', 
                            borderRadius: '50%', 
                            fontSize: '30px', 
                            color: "white",
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Start Test
                    </button>
                )}

                {isLoading && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            border: '4px solid white',
                            borderTop: '4px solid transparent', 
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}>
                        </div>
                        <p style={{ marginTop: '1rem' }}>Testing your connection...</p>
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                {results && !isLoading && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '2rem',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '2rem',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Download</h2>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    {results.downloadSpeed.toFixed(2)} <span style={{ fontSize: '1rem' }}>Mbps</span>
                                </p>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Upload</h2>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    {results.uploadSpeed.toFixed(2)} <span style={{ fontSize: '1rem' }}>Mbps</span>
                                </p>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ping</h2>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    {results.ping} <span style={{ fontSize: '1rem' }}>ms</span>
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setResults(null);
                                startTest();
                            }}
                            style={{
                                marginTop: '2rem',
                                padding: '1rem 2rem',
                                backgroundColor: 'white',
                                color: 'red',
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Test Again
                        </button>
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(255,0,0,0.2)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
