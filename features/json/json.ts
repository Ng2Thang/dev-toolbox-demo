export type JsonIndent = 2 | 4 | 'tab';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function formatJson(input: string, indent: JsonIndent = 2, sortKeys = false): string {
  if (!input.trim()) {
    throw new Error('JSON input is required.');
  }

  try {
    const parsed: JsonValue = JSON.parse(input);
    return JSON.stringify(
      sortKeys ? sortJsonKeys(parsed) : parsed,
      null,
      indent === 'tab' ? '\t' : indent,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }

    throw error;
  }
}

function sortJsonKeys(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortJsonKeys(child)]),
    );
  }

  return value;
}
