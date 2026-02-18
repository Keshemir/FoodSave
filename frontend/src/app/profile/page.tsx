'use client';

import { User, Settings, LogOut } from 'lucide-react';
import OfferCard from '../../components/OfferCard';

export default function ProfilePage() {
    // Mock User Data
    const user = {
        name: 'Alrakhymzhan',
        role: 'Business',
        rating: 4.8,
        offersCount: 12
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-6 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    <Settings className="text-gray-400 w-6 h-6" />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-semibold">{user.role}</span>
                            <span>⭐ {user.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold text-green-700">{user.offersCount}</div>
                        <div className="text-xs text-green-600">Раздал</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold text-orange-700">42 кг</div>
                        <div className="text-xs text-orange-600">Спасено еды</div>
                    </div>
                </div>
            </div>

            <div className="px-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Мои объявления</h3>

                {/* Mock Offers */}
                <OfferCard
                    type="sale"
                    title="Вкусная еда (Тест)"
                    address="Абая 15"
                    imageUrl="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
                    price={1000}
                    status="active"
                    expiryDate="2024"
                    distance="0.0 km"
                />
            </div>

            <div className="p-4 mt-4">
                <button className="w-full bg-white border border-red-200 text-red-500 py-3 rounded-xl flex items-center justify-center font-medium">
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                </button>
            </div>

        </div>
    );
}
