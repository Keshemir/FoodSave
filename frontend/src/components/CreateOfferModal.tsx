import { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Coffee, Flame, CakeSlice } from 'lucide-react';

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

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const initData = (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) || '';
            const tgUser = (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) || null;
            const currentUserId = tgUser?.id || 1;

            const res = await fetch(`${apiUrl}/offers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(initData ? { 'Authorization': `tma ${initData}` } : {})
                },
                body: JSON.stringify({
                    owner_id: currentUserId,
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
                const errorText = await res.text();
                alert(`Не удалось создать: ${errorText}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Ошибка сети: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
            <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-[17px] text-gray-900 tracking-tight">Новое объявление</h3>
                    <button onClick={onClose} className="p-1.5 bg-gray-100 active:bg-gray-200 text-gray-500 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-3">

                    {/* Type Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('sale')}
                            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${type === 'sale' ? 'bg-white shadow text-gray-900 scale-100' : 'text-gray-500 scale-95 hover:text-gray-700'}`}
                        >
                            Продажа
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('free')}
                            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${type === 'free' ? 'bg-[#4CAF50] text-white shadow scale-100' : 'text-gray-500 scale-95 hover:text-gray-700'}`}
                        >
                            Бесплатно
                        </button>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setCategory('bakery')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'bakery' ? 'border-orange-500 bg-orange-50 text-orange-700 scale-[1.02]' : 'border-gray-100 text-gray-400 bg-gray-50'}`}
                            >
                                <Coffee className="w-5 h-5 mb-0.5" />
                                <span className="text-[11px] font-bold">Выпечка</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('hot')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'hot' ? 'border-red-500 bg-red-50 text-red-700 scale-[1.02]' : 'border-gray-100 text-gray-400 bg-gray-50'}`}
                            >
                                <Flame className="w-5 h-5 mb-0.5" />
                                <span className="text-[11px] font-bold">Горячее</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('cold')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === 'cold' ? 'border-blue-500 bg-blue-50 text-blue-700 scale-[1.02]' : 'border-gray-100 text-gray-400 bg-gray-50'}`}
                            >
                                <CakeSlice className="w-5 h-5 mb-0.5" />
                                <span className="text-[11px] font-bold">Десерты</span>
                            </button>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-[14px] focus:bg-white focus:border-green-500 outline-none text-[15px] font-medium transition-colors placeholder:font-normal"
                            placeholder="Название (например: Свежий хлеб)"
                            required
                        />
                    </div>

                    {/* Location Picker */}
                    <div>
                        <div className="flex space-x-2 mb-2">
                            <button
                                type="button"
                                onClick={onPickLocation}
                                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 border rounded-[14px] text-[13px] font-bold transition-all ${pickedLocation ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <MapPin className={`w-4 h-4 ${pickedLocation ? 'text-[#4CAF50]' : 'text-gray-400'}`} />
                                <span>{pickedLocation ? 'Место выбрано' : 'Указать на карте'}</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                value={entrance}
                                onChange={(e) => setEntrance(e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-green-500 transition-colors text-center"
                                placeholder="Подъезд"
                            />
                            <input
                                type="text"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-green-500 transition-colors text-center"
                                placeholder="Этаж"
                            />
                            <input
                                type="text"
                                value={apt}
                                onChange={(e) => setApt(e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-green-500 transition-colors text-center"
                                placeholder="Кв/Офис"
                            />
                        </div>
                    </div>

                    {/* Image URL & Price Row */}
                    <div className="flex gap-2">
                        <div className="relative flex-[2]">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2.5 pl-9 bg-gray-50 border border-gray-100 rounded-[14px] focus:bg-white focus:border-green-500 outline-none text-[13px] font-medium transition-colors"
                                placeholder="Фото (ссылка)"
                            />
                            <ImageIcon className="absolute left-3 top-[11px] w-4 h-4 text-gray-400" />
                        </div>
                        
                        {type === 'sale' && (
                            <div className="flex-[1.2] relative">
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-[14px] focus:bg-white focus:border-green-500 outline-none text-[14px] font-bold text-gray-900 transition-colors"
                                    placeholder="1000"
                                    required
                                />
                                <span className="absolute right-3 top-[10px] text-[14px] font-bold text-gray-400">₸</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !pickedLocation}
                            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white font-bold py-3.5 rounded-[16px] transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] shadow-[0_4px_14px_rgba(76,175,80,0.3)] text-[15px]"
                        >
                            {loading ? 'Публикация...' : (!pickedLocation ? 'Выберите место на карте' : 'Опубликовать')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
