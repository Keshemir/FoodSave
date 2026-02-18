'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Coffee, Pizza, IceCream } from 'lucide-react';

interface CreateOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPickLocation: () => void;
    pickedLocation: { lat: number; lng: number } | null;
}

export default function CreateOfferModal({ isOpen, onClose, onPickLocation, pickedLocation }: CreateOfferModalProps) {
    const [type, setType] = useState<'sale' | 'free'>('sale');
    const [category, setCategory] = useState<'bakery' | 'hot' | 'cold'>('bakery');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('1000');
    const [imageUrl, setImageUrl] = useState('');

    // Address Details
    const [entrance, setEntrance] = useState('');
    const [floor, setFloor] = useState('');
    const [apt, setApt] = useState('');

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!pickedLocation) {
            alert('Пожалуйста, выберите место на карте!');
            return;
        }

        setLoading(true);

        try {
            // Construct Address String
            const addressParts: string[] = [];
            if (entrance) addressParts.push(`Подъезд ${entrance}`);
            if (floor) addressParts.push(`Этаж ${floor}`);
            if (apt) addressParts.push(`Кв ${apt}`);
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Без деталей';

            const res = await fetch('http://localhost:8080/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner_id: 1,
                    type: type,
                    category: category,
                    title: title,
                    address: fullAddress,
                    image_url: imageUrl,
                    price: type === 'free' ? 0 : Number(price),
                    expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    latitude: pickedLocation.lat,
                    longitude: pickedLocation.lng,
                    status: 'active'
                }),
            });

            if (res.ok) {
                alert('Объявление создано!');
                onClose();
                window.location.reload();
            } else {
                alert('Не удалось создать объявление');
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при создании');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg">Новое объявление</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">

                    {/* Type Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setType('sale')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'sale' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Продажа
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('free')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'free' ? 'bg-green-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Бесплатно
                        </button>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setCategory('bakery')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'bakery' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Coffee className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Выпечка</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('hot')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'hot' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Pizza className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Горячее</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('cold')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'cold' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <IceCream className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Холодное</span>
                            </button>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Например: Свежий хлеб"
                            required
                        />
                    </div>

                    {/* Location Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Местоположение</label>
                        <div className="flex space-x-2 mb-2">
                            <button
                                type="button"
                                onClick={onPickLocation}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 border rounded-xl font-medium transition-colors ${pickedLocation ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <MapPin className={`w-5 h-5 ${pickedLocation ? 'text-green-600' : 'text-gray-400'}`} />
                                <span>{pickedLocation ? 'Место выбрано' : 'Указать на карте'}</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <input
                                type="text"
                                value={entrance}
                                onChange={(e) => setEntrance(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Подъезд"
                            />
                            <input
                                type="text"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Этаж"
                            />
                            <input
                                type="text"
                                value={apt}
                                onChange={(e) => setApt(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Кв/Офис"
                            />
                        </div>
                    </div>

                    {/* Image URL Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Фото (ссылка)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                placeholder="https://..."
                            />
                            <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Price Input */}
                    {type === 'sale' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₸)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold"
                                placeholder="1000"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Публикуется...' : 'Опубликовать'}
                    </button>
                </form>
            </div>
        </div>
    );
}
