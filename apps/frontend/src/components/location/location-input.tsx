'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePlacesAutocomplete } from '@/hooks/use-places-autocomplete';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

type LocationInputProps = {
  value: string;
  name: string;
  onChange: (value: {
    coordinates: [number, number];
    displayName: string;
    error?: string;
  }) => void;
};

export function LocationInput({ value, name, onChange }: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { initAutocomplete, isLoaded } = usePlacesAutocomplete({
    apiKey: GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      if (place.formatted_address) {
        onChange({
          coordinates: [
            place.geometry?.location.lat()!,
            place.geometry?.location.lng()!,
          ],
          displayName: place.formatted_address,
        });
      }
    },
    options: {
      componentRestrictions: { country: 'in' },
    },
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      initAutocomplete(inputRef.current);
    }
  }, [isLoaded, initAutocomplete]);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      onChange({ coordinates: [0, 0], displayName: '', error: 'Geolocation not supported.' });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || '';
          const state = data?.address?.state || '';
          const country = data?.address?.country || '';

          onChange({
            coordinates: [latitude, longitude],
            displayName: `${city}, ${state}, ${country}`,
          });
        } catch (err) {
          console.error('Error fetching reverse geocoding:', err);
          onChange({ coordinates: [latitude, longitude], displayName: '', error: 'Failed to fetch location' });
        }

        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        onChange({ coordinates: [0, 0], displayName: '', error: 'Permission denied' });
        setIsLocating(false);
      },
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <div className="flex items-center space-x-2">
        <Input
          name={name}
          id="location"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange({
            coordinates: [0, 0],
            displayName: e.target.value,
          })}
          placeholder="Enter your location"
          className="flex-1"
        />
        <Button variant="outline" onClick={handleUseCurrentLocation} disabled={isLocating}>
          {isLocating ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
