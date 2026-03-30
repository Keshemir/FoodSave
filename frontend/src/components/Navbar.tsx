'use client';

import { Map, List, User, PlusCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
    onPostClick: () => void;
}

export default function Navbar({ onPostClick }: NavbarProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
            <div className="px-4 h-16 flex justify-between items-center w-full max-w-md mx-auto">
                <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors flex flex-col items-center">
                    <Map className="w-6 h-6 mb-0.5" />
                </Link>

                <Link href="/feed" className="text-gray-400 hover:text-green-600 transition-colors flex flex-col items-center">
                    <List className="w-6 h-6 mb-0.5" />
                </Link>

                {/* Central Post Button */}
                <button
                    onClick={onPostClick}
                    className="flex items-center justify-center bg-green-600 text-white w-12 h-12 rounded-full hover:bg-green-700 transition-transform active:scale-95 shadow-lg shrink-0 -mt-6 border-4 border-white"
                >
                    <PlusCircle className="w-6 h-6" />
                </button>

                <Link href="/messages" className="text-gray-400 hover:text-green-600 transition-colors flex flex-col items-center">
                    <MessageCircle className="w-6 h-6 mb-0.5" />
                </Link>

                <Link href="/profile" className="text-gray-400 hover:text-green-600 transition-colors flex flex-col items-center">
                    <User className="w-6 h-6 mb-0.5" />
                </Link>
            </div>
        </nav>
    );
}
