// Type definitions for Google Maps JavaScript API 3.51
// This is a simplified version focused on Places Autocomplete

declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean)
    lat(): number
    lng(): number
    toString(): string
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng)
    contains(latLng: LatLng): boolean
    equals(other: LatLngBounds): boolean
    extend(point: LatLng): LatLngBounds
    getCenter(): LatLng
    getNorthEast(): LatLng
    getSouthWest(): LatLng
    intersects(other: LatLngBounds): boolean
    isEmpty(): boolean
    toJSON(): object
    toString(): string
    union(other: LatLngBounds): LatLngBounds
  }

  namespace places {
    interface AutocompletionRequest {
      bounds?: LatLngBounds
      componentRestrictions?: ComponentRestrictions
      input: string
      location?: LatLng
      offset?: number
      radius?: number
      sessionToken?: AutocompleteSessionToken
      types?: string[]
    }

    interface ComponentRestrictions {
      country: string | string[]
    }

    interface AutocompleteOptions {
      bounds?: LatLngBounds
      componentRestrictions?: ComponentRestrictions
      fields?: string[]
      placeIdOnly?: boolean
      strictBounds?: boolean
      types?: string[]
    }

    class AutocompleteSessionToken {}

    interface PlaceResult {
      address_components?: AddressComponent[]
      formatted_address?: string
      geometry?: PlaceGeometry
      name?: string
      place_id?: string
      types?: string[]
      url?: string
      vicinity?: string
    }

    interface AddressComponent {
      long_name: string
      short_name: string
      types: string[]
    }

    interface PlaceGeometry {
      location: LatLng
      viewport: LatLngBounds
    }

    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
      getBounds(): LatLngBounds
      getPlace(): PlaceResult
      setBounds(bounds: LatLngBounds | null): void
      setComponentRestrictions(restrictions: ComponentRestrictions | null): void
      setFields(fields: string[] | null): void
      setOptions(options: AutocompleteOptions): void
      setTypes(types: string[] | null): void
      addListener(eventName: string, handler: Function): MapsEventListener
    }
  }

  interface MapsEventListener {
    remove(): void
  }
}
