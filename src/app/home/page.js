'use client';

export default function SpeedTestUI() {
    return (
        <div style={{ backgroundColor: 'red', width: '100%', height: '100vh',  display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <div>
                <h1>Internet Speed Test</h1>
            <button style={{ backgroundColor: 'red', border:"4px solid white", width: '200px', height: '200px', borderRadius: '50%' ,fontSize: '30px',color:"white"}}>Start Test</button>
            </div>
        </div>
    );
}
