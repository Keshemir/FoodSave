'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface Chat {
    userId: number;
    name: string;
    lastMessage: string;
    time: string;
    unread?: number;
}

// Mock chats for now — in production, fetch from API
const mockChats: Chat[] = [
    { userId: 2, name: 'Продавец Хлеба', lastMessage: 'Ещё доступно?', time: '10:32', unread: 2 },
    { userId: 3, name: 'Анна', lastMessage: 'Спасибо, уже взяла!', time: 'Вчера' },
];

export default function MessagesPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white px-4 py-5 shadow-sm sticky top-16 z-10">
                <h1 className="text-2xl font-bold text-gray-900">Сообщения</h1>
            </div>

            <div className="divide-y divide-gray-100 bg-white mt-2">
                {mockChats.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">Нет сообщений</p>
                    </div>
                ) : (
                    mockChats.map((chat) => (
                        <Link
                            key={chat.userId}
                            href={`/messages/${chat.userId}`}
                            className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg shrink-0">
                                {chat.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-900 text-sm">{chat.name}</span>
                                    <span className="text-xs text-gray-400">{chat.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread && (
                                <div className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                    {chat.unread}
                                </div>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
