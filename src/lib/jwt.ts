export interface JwtClaims {
  sub?: string;
  email?: string;
  userId?: string;
  jti?: string;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: unknown;
}

export function parseJwt(token: string): JwtClaims | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
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
