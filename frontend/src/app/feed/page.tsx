'use client';

import { useEffect, useState } from 'react';
import OfferCard from '../../components/OfferCard';
import { fetchOffers } from '../../lib/api';
import { PublicOffer } from '../../lib/api.types';

export default function FeedPage() {
    const [offers, setOffers] = useState<PublicOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await fetchOffers();
            setOffers(data);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 shadow-sm sticky top-16 z-10">
                <h1 className="text-2xl font-bold text-gray-900">Лента</h1>
            </div>

            <div className="p-4 container mx-auto max-w-md">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Загрузка...</div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Пока нет объявлений рядом.</div>
                ) : (
                    offers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            type={offer.type}
                            category={offer.category}
                            title={offer.title}
                            address={offer.address}
                            imageUrl={offer.image_url}
                            price={offer.price}
                            status={offer.status}
                            expiryDate={offer.expiry_date}
                            ownerId={offer.owner_id}
                        />
                    ))
                )}
            </div>

        </div>
    );
}
