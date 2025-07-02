import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MapEvents = ({ onLocationSelect }) => {
    const [marker, setMarker] = useState(null);

    const map = useMapEvents({
        click(e) {
            const location = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };

            // Remove previous marker if exists
            if (marker) {
                marker.remove();
            }

            // Create custom marker icon
            const customIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
                shadowSize: [41, 41]
            });

            // Add new marker
            const newMarker = L.marker([location.lat, location.lng], {
                icon: customIcon
            }).addTo(map);

            // Add popup to marker
            newMarker.bindPopup(`
                Selected Location<br />
                Lat: ${location.lat.toFixed(4)}<br />
                Lng: ${location.lng.toFixed(4)}
            `).openPopup();

            setMarker(newMarker);
            onLocationSelect(location);
        }
    });

    // Cleanup marker on unmount
    useEffect(() => {
        return () => {
            if (marker) {
                marker.remove();
            }
        };
    }, [marker]);

    return null;
};

export default MapEvents;
