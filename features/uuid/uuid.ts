export function generateUuids(requestedCount: string): string[] {
  const count = Math.min(20, Math.max(1, Number.parseInt(requestedCount, 10) || 1));

  return Array.from({ length: count }, () => crypto.randomUUID());
}
