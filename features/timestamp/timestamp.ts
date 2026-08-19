export function convertTimestamp(timestamp: string): string {
  const value = Number(timestamp);

  if (!Number.isFinite(value)) {
    throw new Error('Enter a valid numeric Unix timestamp.');
  }

  const date = new Date(value < 100_000_000_000 ? value * 1000 : value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Timestamp is outside the supported date range.');
  }

  return `${date.toISOString()}\n\nLocal: ${date.toLocaleString()}`;
}
