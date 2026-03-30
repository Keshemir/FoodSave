'use client';

import { useState } from 'react';
import Map from '../components/Map';
import BottomSheet from '../components/BottomSheet';
import { Search, LocateFixed, Flame, Croissant, CakeSlice, CupSoda, Store } from 'lucide-react';

declare global {
    interface Window {
        __mapCenterCallback?: (lat: number, lng: number) => void;
    }
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [sheetState, setSheetState] = useState<'collapsed' | 'peek' | 'expanded'>('peek');

    const famousCafes = [
        { id: 1, name: 'Скуратов Ростерс', author: '@alex_coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400&h=300', span: 'col-span-2 row-span-1 h-32' },
        { id: 2, name: 'Даблби', author: '@moscow_guide', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300&h=400', span: 'col-span-1 row-span-2 h-48' },
        { id: 3, name: 'Кофемания', author: '@foodie_ru', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=300&h=400', span: 'col-span-1 row-span-2 h-48' },
        { id: 4, name: 'Surf Coffee', author: '@surf_vibes', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=300', span: 'col-span-2 row-span-1 h-32' },
    ];

    const categories = [
        { id: 'hot', label: 'Горячее', icon: Flame },
        { id: 'bakery', label: 'Выпечка', icon: Croissant },
        { id: 'cold', label: 'Десерты', icon: CakeSlice },
        { id: 'drinks', label: 'Напитки', icon: CupSoda },
    ];

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Current Location:", position.coords.latitude, position.coords.longitude);
                    alert(`Текущая локация получена: \n${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Не удалось определить локацию");
                }
            );
        }
    };

    return (
        <main style={{ position: 'fixed', inset: 0, zIndex: 0 }} className="font-sans antialiased">
            <Map
                onCenterChange={(lat, lng) => {
                    window.__mapCenterCallback?.(lat, lng);
                }}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                onMapClick={() => setSheetState('collapsed')}
            />

            {/* Discover UI Overlay (Docked just above the BottomSheet Grabber) */}
            <div className={`absolute inset-x-0 bottom-[48px] pb-[env(safe-area-inset-bottom)] pointer-events-none z-10 flex flex-col justify-end gap-3 transition-opacity duration-300 ${sheetState !== 'collapsed' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                
                {/* Floating Category Filters */}
                <div className="pointer-events-auto px-4 w-full max-w-md mx-auto">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            const Icon = cat.icon;
                            return (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                                    className={`px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-1.5 shrink-0 shadow-sm border transition-all ${
                                        isActive 
                                        ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-md scale-105' 
                                        : 'bg-white/90 backdrop-blur-md border-white text-gray-800 hover:bg-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" /> 
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section - Search & Location */}
                <div className="pointer-events-auto px-4 w-full max-w-md mx-auto flex items-center gap-2">
                    
                    {/* Compact Search Bar */}
                    <div className="relative flex-1 flex items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-white">
                        <div className="pl-4 pr-2 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            onClick={() => setSheetState('collapsed')}
                            className="block w-full py-3 bg-transparent text-gray-900 border-none focus:ring-0 placeholder-gray-500 font-medium text-[15px] outline-none"
                            placeholder="Найти еду..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            onClick={handleGeolocation}
                            className="p-3 bg-gray-50/50 rounded-r-2xl text-blue-600 hover:text-blue-700 transition-colors active:scale-95 border-l border-gray-100"
                            title="Поделиться локацией"
                        >
                            <LocateFixed className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Draggable Bottom Sheet Layer */}
            <BottomSheet state={sheetState} onStateChange={setSheetState}>
                <div className="pb-8">
                    <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900 px-1">Знаменитые кафешки</h2>
                    
                    {/* Bento Grid Layout for Cards */}
                    <div className="grid grid-cols-2 gap-3 pb-8">
                        {famousCafes.map((cafe) => (
                            <div key={cafe.id} className={`relative rounded-[20px] overflow-hidden group select-none shadow-sm cursor-pointer border border-gray-100/50 ${cafe.span || 'h-40'}`}>
                                <img 
                                    src={cafe.image} 
                                    alt={cafe.name} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <p className="text-[10px] font-medium text-white/80 mb-0.5 tracking-wide uppercase">{cafe.author}</p>
                                    <p className="font-bold text-[15px] leading-tight drop-shadow-md">{cafe.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </BottomSheet>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
