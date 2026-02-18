'use client';

import dynamic from 'next/dynamic';

interface MapProps {
    onCenterChange?: (lat: number, lng: number) => void;
}

const MapInner = dynamic(() => import('./MapInner'), {
    ssr: false,
    loading: () => <div className="h-[100vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function Map(props: MapProps) {
    return <MapInner {...props} />;
}
