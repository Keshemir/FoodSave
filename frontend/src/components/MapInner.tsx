'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { fetchOffers } from '../lib/api';
import { PublicOffer } from '../lib/api.types';

// Custom Icons
const iconSize = [25, 41] as [number, number];
const iconAnchor = [12, 41] as [number, number];
const popupAnchor = [1, -34] as [number, number];

const SaleIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
    shadowSize: [41, 41]
});

const FreeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
    shadowSize: [41, 41]
});

// Helper component to listen to map events
function MapController({ onCenterChange }: { onCenterChange?: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        moveend: () => {
            if (onCenterChange) {
                const center = map.getCenter();
                onCenterChange(center.lat, center.lng);
            }
        },
    });
    return null;
}

interface MapInnerProps {
    onCenterChange?: (lat: number, lng: number) => void;
    searchQuery?: string;
    activeCategory?: string | null;
}

export default function MapInner({ onCenterChange, searchQuery, activeCategory }: MapInnerProps) {
    const [offers, setOffers] = useState<PublicOffer[]>([]);
    // Coordinates for Astana, Kazakhstan
    const astanaRaw = [51.169392, 71.449074];
    // Leaflet expects LatLngTuple which is [number, number]. 
    // We cast explicitly to avoid TS errors with generic arrays.
    const astana = astanaRaw as L.LatLngExpression;

    useEffect(() => {
        async function load() {
            const data = await fetchOffers();
            setOffers(data);
        }
        load();
    }, []);

    const filteredOffers = offers.filter((offer) => {
        if (activeCategory && offer.category !== activeCategory) return false;
        if (searchQuery && !offer.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <MapContainer center={astana} zoom={13} scrollWheelZoom={true} className="h-[100vh] w-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {onCenterChange && <MapController onCenterChange={onCenterChange} />}

            <MarkerClusterGroup chunkedLoading>
                {filteredOffers.map((offer) => (
                    <Marker
                        key={offer.id}
                        position={[offer.latitude, offer.longitude] as L.LatLngExpression}
                        icon={offer.type === 'free' ? FreeIcon : SaleIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="w-48 rounded-xl overflow-hidden bg-white shadow-xl flex flex-col cursor-pointer hover:shadow-2xl transition-shadow">
                                <div className="h-32 w-full relative">
                                    <img 
                                        src={offer.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=300'} 
                                        alt={offer.title} 
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase ${offer.type === 'free' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {offer.type === 'free' ? 'БЕСПЛАТНО' : 'ПРОДАЖА'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">{offer.title}</h3>
                                    <p className="font-black text-green-600 text-lg">{offer.type === 'free' ? '0₸' : `${offer.price}₸`}</p>
                                    <div className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">{offer.category}</div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
