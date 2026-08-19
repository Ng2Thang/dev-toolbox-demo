export function concatenateLines(items: string, separator: string): string {
  return items
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(separator);
}
