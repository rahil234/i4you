export function getDistanceInKm(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

// Example usage
const coord1: [number, number] = [11.2952824, 75.8231807]; // Moozhikkal
const coord2: [number, number] = [11.2261464, 75.7853685]; // Thiruvannur
const distance = getDistanceInKm(coord1, coord2);
console.log(`Distance: ${distance.toFixed(2)} km`); // Output: Distance: 878.83 km
