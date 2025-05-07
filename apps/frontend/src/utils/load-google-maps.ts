// Singleton pattern to ensure the script is loaded only once
let googleMapsPromise: Promise<typeof google> | null = null;

export const loadGoogleMapsApi = (apiKey: string): Promise<typeof google> => {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      return resolve(window.google);
    }

    // Create a unique callback name
    const callbackName = `googleMapsInitCallback_${Date.now()}`

      // Add the callback to window
    ;(window as any)[callbackName] = () => {
      resolve(window.google);
      // Clean up
      delete (window as any)[callbackName];
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (error: any) => {
      reject(new Error(`Google Maps script failed to load: ${error?.type}`));
      googleMapsPromise = null; // Reset so we can try again
    };

    // Append script to document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Type definitions
declare global {
  interface Window {
    google: any;
  }
}
