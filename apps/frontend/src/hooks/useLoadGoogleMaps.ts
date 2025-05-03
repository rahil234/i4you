'use client';

import { useEffect, useState } from 'react';

export function useLoadGoogleMaps(apiKey: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.getElementById('google-maps')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  return loaded;
}
