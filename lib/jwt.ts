export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

  try {
    return decodeURIComponent(
      Array.from(
        atob(padded),
        (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      ).join(''),
    );
  } catch {
    throw new Error('JWT contains an invalid Base64URL segment.');
  }
}

function parseJwtObject(segment: string, name: string): Record<string, unknown> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(decodeBase64Url(segment));
  } catch (error) {
    if (error instanceof Error && error.message.includes('Base64URL')) {
      throw error;
    }

    throw new Error(`JWT ${name} must contain valid JSON.`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`JWT ${name} must be a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');

  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error('Invalid JWT format. Expected three dot-separated segments.');
  }

  return {
    header: parseJwtObject(parts[0], 'header'),
    payload: parseJwtObject(parts[1], 'payload'),
  };
}
