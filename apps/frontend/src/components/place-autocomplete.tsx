'use client';

import { useEffect, useRef } from 'react';

interface PlaceAutocompleteProps {
  onPlaceSelectAction: (place: google.maps.places.Place) => void;
}

export default function PlaceAutocomplete({ onPlaceSelectAction }: PlaceAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !containerRef.current) return;

    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: 'in' },
      types: ['address'],
    });
    containerRef.current.appendChild(placeAutocomplete);

    placeAutocomplete.addEventListener('gmp-select', async (event: any) => {
      const place = event.place;
      await place.fetchFields({ fields: ['formattedAddress', 'geometry'] });
      onPlaceSelectAction(place);
    });
  }, [onPlaceSelectAction]);

  return <div ref={containerRef} />;
}
