'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Coffee, Pizza, IceCream, X } from 'lucide-react';

interface OfferCardProps {
    type: 'sale' | 'free';
    category?: string;
    title?: string;
    address?: string;
    price?: number;
    imageUrl?: string;
    status: string;
    expiryDate: string;
    distance?: string;
    ownerId?: number; // seller's user id
}

const SELLER_USER_ID = 2; // fallback mock seller

export default function OfferCard({ type, category, title, address, price = 0, imageUrl, status, expiryDate, distance, ownerId }: OfferCardProps) {
    const [showDetail, setShowDetail] = useState(false);
    const router = useRouter();
    const isFree = type === 'free';

    const getCategoryIcon = () => {
        switch (category) {
            case 'bakery': return <Coffee className="w-3 h-3 mr-1" />;
            case 'hot': return <Pizza className="w-3 h-3 mr-1" />;
            case 'cold': return <IceCream className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    const getCategoryName = () => {
        switch (category) {
            case 'bakery': return 'Выпечка';
            case 'hot': return 'Горячее';
            case 'cold': return 'Холодное';
            default: return '';
        }
    };

    const goToChat = () => {
        const sellerId = ownerId || SELLER_USER_ID;
        router.push(`/messages/${sellerId}`);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full mb-3 flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-48 md:h-auto md:w-48 bg-gray-200">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Нет фото</div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isFree ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>
                            {isFree ? 'БЕСПЛАТНО' : 'ПРОДАЖА'}
                        </span>
                        {category && (
                            <span className="bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-fit">
                                {getCategoryIcon()}{getCategoryName()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                            {title || (isFree ? 'Еда бесплатно' : 'Вкусная еда')}
                        </h3>
                        <div className="text-gray-500 text-xs flex items-center space-x-3 mb-2">
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />24ч осталось</span>
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{distance || address || 'Рядом'}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-xl font-bold text-gray-900">
                            {isFree ? 'Бесплатно' : `${price}₸`}
                        </div>
                        <button
                            onClick={() => setShowDetail(true)}
                            className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all"
                        >
                            {isFree ? 'Забрать' : 'Купить'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Bottom Sheet */}
            {showDetail && (
                <div
                    className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/50"
                    onClick={() => setShowDetail(false)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-t-2xl p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {title || (isFree ? 'Еда бесплатно' : 'Вкусная еда')}
                            </h2>
                            <button onClick={() => setShowDetail(false)} className="p-1 text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {category && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {getCategoryIcon()}{getCategoryName()}
                            </span>
                        )}

                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>{address || 'Адрес не указан'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>Действует 24 часа</span>
                            </div>
                        </div>

                        <div className="text-2xl font-black text-gray-900">
                            {isFree ? 'Бесплатно' : `${price}₸`}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            <button
                                onClick={goToChat}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all"
                            >
                                💬 Написать продавцу
                            </button>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
