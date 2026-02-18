'use client';

import Map from '../components/Map';

// window.__mapCenterCallback is registered by MainLayout
declare global {
    interface Window {
        __mapCenterCallback?: (lat: number, lng: number) => void;
    }
}

export default function Home() {
    return (
        <main style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Map
                onCenterChange={(lat, lng) => {
                    window.__mapCenterCallback?.(lat, lng);
                }}
            />
        </main>
    );
}
