export const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return 'unknown';

  const date = new Date(Number(timestamp));
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};