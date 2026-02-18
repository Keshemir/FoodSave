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
}

export default function MapInner({ onCenterChange }: MapInnerProps) {
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

    return (
        <MapContainer center={astana} zoom={13} scrollWheelZoom={true} className="h-[100vh] w-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {onCenterChange && <MapController onCenterChange={onCenterChange} />}

            <MarkerClusterGroup chunkedLoading>
                {offers.map((offer) => (
                    <Marker
                        key={offer.id}
                        position={[offer.latitude, offer.longitude] as L.LatLngExpression}
                        icon={offer.type === 'free' ? FreeIcon : SaleIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong className="text-sm font-bold block mb-1">{offer.title}</strong>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${offer.type === 'free' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} uppercase`}>
                                    {offer.type === 'free' ? 'БЕСПЛАТНО' : 'ПРОДАЖА'}
                                </span>
                                <br />
                                <span className="text-gray-700 font-bold">{offer.type === 'free' ? '0₸' : `${offer.price}₸`}</span>
                                <br />
                                <span className="text-xs text-gray-400">{offer.category}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
