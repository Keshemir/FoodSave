export type OfferType = 'sale' | 'free';
export type OfferStatus = 'active' | 'booked' | 'closed';

export interface PublicOffer {
    id: number;
    owner_id: number;
    type: OfferType;
    category: 'bakery' | 'hot' | 'cold';
    title: string;
    address: string;
    image_url: string;
    price: number;
    expiry_date: string;
    latitude: number;
    longitude: number;
    status: OfferStatus;
}

export interface User {
    ID: number;
    apple_id: string;
    role: 'private' | 'business';
    rating: number;
}
