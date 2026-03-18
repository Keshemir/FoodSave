import { PublicOffer } from './api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getTelegramInitData = () => {
    // Note: window.Telegram is injected by the <Script> tag in layout.tsx
    if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram.WebApp) {
        return (window as any).Telegram.WebApp.initData || '';
    }
    return '';
};

export async function fetchOffers(): Promise<PublicOffer[]> {
    try {
        const headers: HeadersInit = {};
        const initData = getTelegramInitData();
        if (initData) {
            headers['Authorization'] = `tma ${initData}`;
        }

        const res = await fetch(`${API_URL}/offers`, { 
            cache: 'no-store',
            headers
        });
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
