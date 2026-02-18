'use client';

import { Map, List, User, PlusCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
    onPostClick: () => void;
}

export default function Navbar({ onPostClick }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-[1000] shadow-sm">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl md:text-2xl font-black text-green-600 tracking-tight">
                    FoodSave
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link href="/" className="flex flex-col md:flex-row items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                        <Map className="w-5 h-5" />
                        <span className="hidden md:inline text-sm font-medium">Карта</span>
                    </Link>

                    <Link href="/feed" className="flex flex-col md:flex-row items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                        <List className="w-5 h-5" />
                        <span className="hidden md:inline text-sm font-medium">Лента</span>
                    </Link>

                    {/* Post Button */}
                    <button
                        onClick={onPostClick}
                        className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-transform active:scale-95 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="text-sm font-bold">Пост</span>
                    </button>

                    <Link href="/messages" className="flex flex-col md:flex-row items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors relative">
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden md:inline text-sm font-medium">Чат</span>
                    </Link>

                    <Link href="/profile" className="flex flex-col md:flex-row items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                        <User className="w-5 h-5" />
                        <span className="hidden md:inline text-sm font-medium">Профиль</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
