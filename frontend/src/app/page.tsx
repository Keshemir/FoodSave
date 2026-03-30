'use client';

import { useState } from 'react';
import Map from '../components/Map';
import { Search, Navigation, Utensils, Coffee, Wine, Plus, ChevronUp } from 'lucide-react';

// window.__mapCenterCallback is registered by MainLayout
declare global {
    interface Window {
        __mapCenterCallback?: (lat: number, lng: number) => void;
    }
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const famousCafes = [
        { id: 1, name: 'Скуратов Ростерс', author: '@alex_coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400&h=300' },
        { id: 2, name: 'Даблби', author: '@moscow_guide', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=300' },
        { id: 3, name: 'Кофемания', author: '@foodie_ru', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400&h=300' },
        { id: 4, name: 'Surf Coffee', author: '@surf_vibes', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=300' },
    ];

    return (
        <main style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Map
                onCenterChange={(lat, lng) => {
                    window.__mapCenterCallback?.(lat, lng);
                }}
            />

            {/* Discover UI Overlay - z-index ensures it's above the Map but below modal/navbar if needed */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
                
                {/* Top Section - Search & Location */}
                {/* We add mt-20 to be below the Navbar which is typically h-16 (64px) */}
                <div className="pointer-events-auto p-4 mt-20 flex items-center gap-3 max-w-md mx-auto w-full">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3.5 bg-black text-white rounded-full shadow-lg border-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 font-medium text-sm"
                            placeholder="search for something"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-white p-3.5 rounded-full shadow-lg shrink-0 text-black hover:bg-gray-50 transition-colors">
                        <Navigation className="h-6 w-6" />
                    </button>
                    {/* Ghost button for 'search here' functionality floating above map center */}
                    <button className="absolute top-40 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-md hover:bg-white transition-colors">
                        <Search className="w-4 h-4" />
                        search here
                    </button>
                </div>

                {/* Bottom Section - Filters & Cards */}
                <div className="w-full max-w-md mx-auto relative mt-auto pb-16">
                    {/* Floating Filters */}
                    <div className="pointer-events-auto flex items-center gap-2 px-4 mb-4 overflow-x-auto no-scrollbar scroll-smooth">
                        <button className="bg-black text-white px-4 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shrink-0 shadow-md">
                            <span>discover</span>
                            <ChevronUp className="w-4 h-4 text-white p-0.5 rounded-full bg-white/20" />
                        </button>
                        <button className="bg-white px-4 py-2.5 rounded-full font-bold text-sm flex items-center gap-1.5 shrink-0 shadow-md whitespace-nowrap text-gray-800">
                            <Utensils className="w-4 h-4 text-gray-400" />
                            eat
                        </button>
                        <button className="bg-white px-4 py-2.5 rounded-full font-bold text-sm flex items-center gap-1.5 shrink-0 shadow-md whitespace-nowrap text-gray-800">
                            <Coffee className="w-4 h-4 text-gray-400" />
                            café
                        </button>
                        <button className="bg-white px-4 py-2.5 rounded-full font-bold text-sm flex items-center gap-1.5 shrink-0 shadow-md whitespace-nowrap text-gray-800">
                            <Wine className="w-4 h-4 text-gray-400" />
                            bar
                        </button>
                        <button className="bg-white w-10 h-[40px] rounded-full flex items-center justify-center shrink-0 shadow-md">
                            <Plus className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Bottom Sheet Card */}
                    <div className="pointer-events-auto bg-white rounded-t-3xl shadow-2xl overflow-hidden min-h-[300px] border border-gray-100">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900">знаменитые кафешки</h2>
                            
                            {/* Horizontal Cards */}
                            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
                                {famousCafes.map((cafe) => (
                                    <div key={cafe.id} className="relative w-[180px] shrink-0 h-[220px] rounded-2xl overflow-hidden snap-center group select-none shadow-sm cursor-pointer">
                                        <img 
                                            src={cafe.image} 
                                            alt={cafe.name} 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <p className="text-xs font-medium text-white/80 mb-1">{cafe.author}</p>
                                            <p className="font-bold text-lg leading-tight">{cafe.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Styles to block scrollbars but keep smooth scrolling for horizontal lists */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}
