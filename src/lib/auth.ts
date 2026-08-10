import { parseJwt } from './jwt';

export const TOKEN_KEY = 'slot_auth_token';
export const USER_ID_KEY = 'slot_user_id';
export const USER_EMAIL_KEY = 'slot_user_email';

export interface UserAuthData {
  userId: string | null;
  email: string | null;
  role: string | null;
  name: string | null;
}

/**
 * Stores the authentication token, user ID, and email in localStorage and document cookies.
 */
export function setAuthToken(token: string, userId?: string, email?: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (userId) localStorage.setItem(USER_ID_KEY, userId);
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);

    // Also set standard cookie so both client and server can read token if needed
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.error('Error saving auth token to storage:', err);
  }
}

/**
 * Retrieves the stored auth token from localStorage or cookies.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const tokenFromStorage = localStorage.getItem(TOKEN_KEY);
    if (tokenFromStorage) return tokenFromStorage;

    // Fallback: check cookie
    const match = document.cookie.match(new RegExp('(?:^|; )' + TOKEN_KEY + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Clears stored auth tokens and user session data.
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch (err) {
    console.error('Error clearing auth token:', err);
  }
}

/**
 * Checks if a JWT token is expired based on its `exp` claim.
 */
export function isTokenExpired(token: string): boolean {
  const claims = parseJwt(token);
  if (!claims) return true;

  if (typeof claims.exp === 'number') {
    const currentTime = Math.floor(Date.now() / 1000);
    // If current time is greater than or equal to exp time, it's expired
    return currentTime >= claims.exp;
  }

  return false;
}

/**
 * Validates if an auth token exists and is not expired.
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Extracts user profile information from the token and fallback localStorage keys.
 */
export function getUserInfoFromToken(token: string | null): UserAuthData {
  const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem(USER_EMAIL_KEY) : null;
  const fallbackUserId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null;

  if (!token) {
    return {
      userId: fallbackUserId,
      email: fallbackEmail,
      role: null,
      name: fallbackEmail ? formatNameFromEmail(fallbackEmail) : null,
    };
  }

  const claims = parseJwt(token);
  if (!claims) {
    return {
      userId: fallbackUserId,
      email: fallbackEmail,
      role: null,
      name: fallbackEmail ? formatNameFromEmail(fallbackEmail) : null,
    };
  }

  const email = (claims.email as string) || (claims.sub as string) || fallbackEmail || null;
  const userId = (claims.userId as string) || (claims.nameid as string) || fallbackUserId || null;
  const role =
    (claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string) ||
    (claims.role as string) ||
    null;
  const name = email ? formatNameFromEmail(email) : 'User';

  return { userId, email, role, name };
}

function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || '';
  const firstWord = localPart.split('.')[0] || localPart.split('_')[0] || localPart;
  if (!firstWord) return 'User';
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
}
