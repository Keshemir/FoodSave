import { PublicOffer } from './api.types';

const API_URL = 'http://localhost:8080';

export async function fetchOffers(): Promise<PublicOffer[]> {
    try {
        const res = await fetch(`${API_URL}/offers`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch offers');
        }
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}
