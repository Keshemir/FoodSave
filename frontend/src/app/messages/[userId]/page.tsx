'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
}

const MY_USER_ID = 1; // Mock current user

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const sellerId = Number(params.userId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Load chat history from DB
    useEffect(() => {
        fetch(`http://localhost:8080/messages?user_id=${MY_USER_ID}&peer_id=${sellerId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(() => { });
    }, [sellerId]);

    // Connect WebSocket
    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/ws/chat?user_id=${MY_USER_ID}&peer_id=${sellerId}`);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as Message;
                setMessages(prev => [...prev, msg]);
            } catch { }
        };

        return () => ws.close();
    }, [sellerId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const content = input.trim();

        const msgPayload = {
            sender_id: MY_USER_ID,
            receiver_id: sellerId,
            content,
        };

        // Show immediately (optimistic)
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender_id: MY_USER_ID,
            receiver_id: sellerId,
            content,
            created_at: new Date().toISOString()
        }]);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msgPayload));
        }
        setInput('');
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[100] px-4 py-3 flex items-center gap-3 shadow-sm">
                <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                        П
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">Продавец #{sellerId}</div>
                        <div className={`text-xs ${connected ? 'text-green-500' : 'text-gray-400'}`}>
                            {connected ? 'В сети' : 'Не в сети'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto pt-20 pb-24 px-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-400 pt-16">
                        Начните общение с продавцом
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === MY_USER_ID;
                    return (
                        <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                    ? 'bg-gray-900 text-white rounded-br-sm'
                                    : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                                }`}>
                                <p>{msg.content}</p>
                                <p className="text-[10px] mt-1 text-gray-400 text-right">
                                    {formatTime(msg.created_at)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Написать сообщение..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-all active:scale-95"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
