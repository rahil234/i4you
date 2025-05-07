'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '@/utils/load-google-maps';

interface UsePlacesAutocompleteProps {
  apiKey: string;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  options?: google.maps.places.AutocompleteOptions;
}

export function usePlacesAutocomplete({ apiKey, onPlaceSelect, options = {} }: UsePlacesAutocompleteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load the Google Maps script
  useEffect(() => {
    if (!apiKey) return;

    setIsLoading(true);

    loadGoogleMapsApi(apiKey)
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setError(err);
        setIsLoading(false);
      });
  }, [apiKey]);

  // Initialize autocomplete when the script is loaded and input is available
  const initAutocomplete = (input: HTMLInputElement) => {
    if (!isLoaded || !input) return;

    // Store the input reference
    inputRef.current = input;

    // Create the autocomplete instance
    const defaultOptions: google.maps.places.AutocompleteOptions = {
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      // types: ['(cities)'],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, { ...defaultOptions, ...options });

    // Store the autocomplete reference
    autocompleteRef.current = autocomplete;

    // Add place_changed event listener
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (onPlaceSelect && place) {
        onPlaceSelect(place);
      }
    });

    // Prevent form submission on Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.activeElement === input) {
        e.preventDefault();
      }
    });
  };

  return {
    isLoaded,
    isLoading,
    error,
    autocomplete: autocompleteRef.current,
    initAutocomplete,
  };
}
