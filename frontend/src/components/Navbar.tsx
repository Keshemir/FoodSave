'use client';

import { Map, List, User, PlusCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
    onPostClick: () => void;
}

export default function Navbar({ onPostClick }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[1000] shadow-sm">
            <div className="px-4 h-14 flex justify-between items-center w-full">
                {/* Logo */}
                <Link href="/" className="text-lg font-black text-green-600 tracking-tight shrink-0 mr-4">
                    FoodSave
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center justify-between flex-1 max-w-[280px]">
                    <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors">
                        <Map className="w-5 h-5" />
                    </Link>

                    <Link href="/feed" className="text-gray-400 hover:text-green-600 transition-colors">
                        <List className="w-5 h-5" />
                    </Link>

                    {/* Compact Post Button */}
                    <button
                        onClick={onPostClick}
                        className="flex items-center justify-center bg-green-600 text-white w-10 h-8 rounded-full hover:bg-green-700 transition-transform active:scale-95 shadow-md shrink-0"
                    >
                        <PlusCircle className="w-5 h-5" />
                    </button>

                    <Link href="/messages" className="text-gray-400 hover:text-green-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                    </Link>

                    <Link href="/profile" className="text-gray-400 hover:text-green-600 transition-colors">
                        <User className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
