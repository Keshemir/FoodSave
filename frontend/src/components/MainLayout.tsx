'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import CreateOfferModal from './CreateOfferModal';
import { Check, MapPin } from 'lucide-react';

// Global so the Map on the home page can report its center
declare global {
    interface Window {
        __mapCenterCallback?: (lat: number, lng: number) => void;
    }
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const mapCenter = useRef<{ lat: number; lng: number } | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const handlePickLocation = () => {
        setIsModalOpen(false);
        setIsPickingLocation(true);
        if (pathname !== '/') router.push('/');
    };

    const handleConfirmLocation = () => {
        if (mapCenter.current) setPickedLocation(mapCenter.current);
        setIsPickingLocation(false);
        setIsModalOpen(true);
    };

    // Register a global callback so the Map can update our ref
    useEffect(() => {
        window.__mapCenterCallback = (lat: number, lng: number) => {
            mapCenter.current = { lat, lng };
        };
        return () => { delete window.__mapCenterCallback; };
    }, []);

    return (
        <>
            {/* Fixed Navbar - hidden when picking location */}
            {!isPickingLocation && (
                <Navbar onPostClick={() => setIsModalOpen(true)} />
            )}

            {/* Location Picker Overlay */}
            {isPickingLocation && (
                <>
                    <div className="fixed inset-0 z-[1500] pointer-events-none flex items-center justify-center">
                        <div className="relative -mt-8">
                            <MapPin className="w-10 h-10 text-red-600 fill-red-600 animate-bounce" />
                            <div className="w-2 h-2 bg-black rounded-full absolute -bottom-1 left-4 opacity-50 blur-sm" />
                        </div>
                    </div>
                    <div className="fixed bottom-10 left-0 right-0 z-[2000] flex flex-col items-center gap-4">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
                            Укажите место на карте
                        </div>
                        <button
                            onClick={handleConfirmLocation}
                            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center space-x-2 hover:bg-black transition-transform active:scale-95"
                        >
                            <Check className="w-5 h-5" />
                            <span>Подтвердить</span>
                        </button>
                    </div>
                </>
            )}

            {children}

            <CreateOfferModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPickLocation={handlePickLocation}
                pickedLocation={pickedLocation}
            />
        </>
    );
}
