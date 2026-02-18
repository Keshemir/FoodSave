'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    isPickingLocation: boolean;
    startPickingLocation: () => void;
    stopPickingLocation: () => void;
    pickedLocation: { lat: number; lng: number } | null;
    setPickedLocation: (loc: { lat: number; lng: number } | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const startPickingLocation = () => {
        setIsModalOpen(false);
        setIsPickingLocation(true);
    };

    const stopPickingLocation = () => {
        setIsPickingLocation(false);
        setIsModalOpen(true); // Re-open modal after picking (or confirming)
    };

    return (
        <UIContext.Provider value={{
            isModalOpen,
            openModal,
            closeModal,
            isPickingLocation,
            startPickingLocation,
            stopPickingLocation,
            pickedLocation,
            setPickedLocation
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
