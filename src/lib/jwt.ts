export interface JwtClaims {
  sub?: string;
  email?: string;
  userId?: string;
  nameid?: string;
  jti?: string;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  iss?: string;
  aud?: string;
  [key: string]: unknown;
}

export function parseJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Handle base64 decoding in environment safely
    let jsonPayload: string;
    if (typeof window !== 'undefined' && window.atob) {
      jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else {
      jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    }

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserRoleFromToken(token: string): string | null {
  const claims = parseJwt(token);
  if (!claims) return null;
  return (
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    (claims.role as string) ||
    null
  );
}
