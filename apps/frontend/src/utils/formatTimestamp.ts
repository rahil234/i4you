export const formatTimestamp = (timestamp: Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (hours < 1) {
    if (minutes > 0) return `${minutes} min ago`;
    if (seconds > 0) return `${seconds} sec ago`;
    if (seconds <= 0 && seconds > -60) return 'now';
  } else if (hours < 24) {
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } else if (hours >= 24 && hours < 48) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      timeZone: 'Asia/Kolkata',
    });
  } else {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  }

  return 'unknown';
};
