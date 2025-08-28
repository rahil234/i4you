'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding-layout';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Input } from '@/components/ui/input';
import { usePlacesAutocomplete } from '@/hooks/use-places-autocomplete';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function OnboardingLocation() {
  const { data, setLocation } = useOnboardingStore();
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { initAutocomplete, isLoaded } = usePlacesAutocomplete({
    apiKey: GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      if (place.formatted_address) {
        setLocation({
          coordinates: [place.geometry?.location.lat()!, place.geometry?.location.lng()!],
          displayName: place.formatted_address,
        });
      }
    },
    options: {
      // types: ["(cities)"],
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
      setLocation(
        {
          error: 'Geolocation is not supported by this browser.',
        });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await response.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || '';
          const state = data?.address?.state || '';
          const country = data?.address?.country || '';

          setLocation({
            coordinates: [latitude, longitude],
            displayName: `${city}, ${state}, ${country}`,
          });
        } catch (error) {
          setLocation({
            error: 'Unable to fetch location data.',
          });
          console.error('Error fetching location:', error);
        }

        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocation({ error: 'Permission denied or unavailable' });
        setIsLocating(false);
      },
    );
  };

  return (
    <OnboardingLayout currentStep="location">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your location</h1>
        <p className="text-muted-foreground mb-6">Set your location to help us find people near you</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex justify-between items-center space-x-2">
              <Input
                id="location"
                ref={inputRef}
                value={data.location.displayName}
                onChange={(e) => setLocation({
                  coordinates: data.location.coordinates,
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
        </div>
      </div>
    </OnboardingLayout>
  );
}
