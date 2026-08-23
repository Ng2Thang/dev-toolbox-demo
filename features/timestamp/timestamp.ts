export type TimestampUnit = 'seconds' | 'milliseconds';

export type TimestampResult = {
  local: string;
  milliseconds: number;
  seconds: number;
  unit: TimestampUnit;
  utc: string;
};

function parseTimestamp(timestamp: string) {
  if (!timestamp.trim()) {
    throw new Error('Enter a Unix timestamp.');
  }

  const value = Number(timestamp);

  if (!Number.isFinite(value)) {
    throw new Error('Enter a valid numeric Unix timestamp.');
  }

  return value;
}

export function convertTimestamp(timestamp: string, unit: TimestampUnit): TimestampResult {
  const input = parseTimestamp(timestamp);
  const milliseconds = unit === 'seconds' ? input * 1000 : input;
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Timestamp is outside the supported date range.');
  }

  return {
    local: date.toLocaleString(),
    milliseconds,
    seconds: milliseconds / 1000,
    unit,
    utc: date.toISOString(),
  };
}

export function convertDateTime(dateTime: string): TimestampResult {
  if (!dateTime) {
    throw new Error('Choose a valid date and time.');
  }

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Choose a valid date and time.');
  }

  const milliseconds = date.getTime();

  return {
    local: date.toLocaleString(),
    milliseconds,
    seconds: milliseconds / 1000,
    unit: 'milliseconds',
    utc: date.toISOString(),
  };
}

export function formatTimestampResult(result: TimestampResult) {
  return [
    `UTC: ${result.utc}`,
    `Local: ${result.local}`,
    `Unix seconds: ${result.seconds}`,
    `Unix milliseconds: ${result.milliseconds}`,
  ].join('\n');
}
