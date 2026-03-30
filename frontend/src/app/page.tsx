'use client';

import { useState } from 'react';
import Map from '../components/Map';
import BottomSheet from '../components/BottomSheet';
import { Search, Navigation, Utensils, Coffee, Wine, Plus, ChevronUp, LocateFixed } from 'lucide-react';

// window.__mapCenterCallback is registered by MainLayout
declare global {
    interface Window {
        __mapCenterCallback?: (lat: number, lng: number) => void;
    }
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const famousCafes = [
        { id: 1, name: 'Скуратов Ростерс', author: '@alex_coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400&h=300', span: 'col-span-2 row-span-1 h-32' },
        { id: 2, name: 'Даблби', author: '@moscow_guide', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300&h=400', span: 'col-span-1 row-span-2 h-48' },
        { id: 3, name: 'Кофемания', author: '@foodie_ru', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=300&h=400', span: 'col-span-1 row-span-2 h-48' },
        { id: 4, name: 'Surf Coffee', author: '@surf_vibes', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=300', span: 'col-span-2 row-span-1 h-32' },
    ];

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Current Location:", position.coords.latitude, position.coords.longitude);
                    // In a full implementation, this would pan the map to these coordinates
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
            />

            {/* Discover UI Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex flex-col pt-[72px] pb-[160px]">
                
                {/* Top Section - Search & Location */}
                <div className="pointer-events-auto px-4 flex items-start gap-3 max-w-md mx-auto w-full justify-between">
                    
                    {/* Compact Search Bar Top-Left */}
                    <div className="relative flex-1 max-w-[240px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 font-medium text-sm transition-all"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Geolocation Button */}
                    <button 
                        onClick={handleGeolocation}
                        className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] shrink-0 text-blue-600 hover:bg-white transition-colors active:scale-95"
                    >
                        <LocateFixed className="h-5 w-5" />
                    </button>
                    
                </div>

                {/* Floating Filters (placed near bottom of the available free space) */}
                <div className="mt-auto pointer-events-auto px-4 w-full max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        <button className="bg-black/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-2 shrink-0 shadow-sm border border-black/10">
                            <span>discover</span>
                            <ChevronUp className="w-4 h-4 text-white p-[2px] rounded-full bg-white/20" />
                        </button>
                        <button className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-1.5 shrink-0 shadow-sm border border-white/40 text-gray-800 transition-colors hover:bg-white/90">
                            <Utensils className="w-4 h-4 text-gray-500" /> eat
                        </button>
                        <button className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-1.5 shrink-0 shadow-sm border border-white/40 text-gray-800 transition-colors hover:bg-white/90">
                            <Coffee className="w-4 h-4 text-gray-500" /> café
                        </button>
                        <button className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-1.5 shrink-0 shadow-sm border border-white/40 text-gray-800 transition-colors hover:bg-white/90">
                            <Wine className="w-4 h-4 text-gray-500" /> bar
                        </button>
                        <button className="bg-white/70 backdrop-blur-md w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/40 transition-colors hover:bg-white/90">
                            <Plus className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Draggable Bottom Sheet Layer */}
            <BottomSheet>
                <div className="pb-8">
                    <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900 px-1">знаменитые кафешки</h2>
                    
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
