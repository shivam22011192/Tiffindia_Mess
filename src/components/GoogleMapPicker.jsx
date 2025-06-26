import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const GoogleMapPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 }); // default to India
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries: ['places'], // 👈 Important for Autocomplete
  });

  const onLoadAutocomplete = (auto) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setPosition({ lat, lng });

        onLocationChange({
          latitude: lat,
          longitude: lng,
          formattedAddress: place.formatted_address || place.name,
        });
      }
    }
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    onLocationChange({
      latitude: lat,
      longitude: lng,
      formattedAddress: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
    });
  };

  return isLoaded ? (
    <div>
      {/* Autocomplete Input */}
      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search area or street"
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </Autocomplete>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
      >
        <Marker
          position={position}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  ) : (
    <p>Loading Google Maps...</p>
  );
};

export default React.memo(GoogleMapPicker);
