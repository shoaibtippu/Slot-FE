import { ApiSignupPayload, ApiSignupResponse, ApiLoginPayload, ApiLoginResponse } from '@/types/auth';
import { setAuthToken } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

export async function signupUser(payload: ApiSignupPayload): Promise<ApiSignupResponse> {
  const url = `${BASE_URL}/api/account/signup`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: ApiSignupResponse = {};
    const responseText = await response.text();

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }
    }

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (typeof data === 'string' ? data : null) ||
        `Signup failed with status code ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('NetworkError')) {
        throw new Error(
          'Unable to reach backend server at https://localhost:7120. Please verify your backend server is running and HTTPS certificate is accepted.'
        );
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during signup.');
  }
}

export async function loginUser(payload: ApiLoginPayload): Promise<ApiLoginResponse> {
  const url = `${BASE_URL}/api/account/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: ApiLoginResponse = {
      accessToken: null,
      email: null,
      userId: null,
      error: null,
    };

    const responseText = await response.text();

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data.error = responseText;
      }
    }

    // Check backend error field or HTTP status error
    if (data.error) {
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error(`Login failed with status code ${response.status}`);
    }

    // Store auth token and user id in localStorage and cookie upon success
    if (data.accessToken) {
      setAuthToken(data.accessToken, data.userId || undefined, data.email || undefined);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('NetworkError')) {
        throw new Error(
          'Unable to reach backend server at https://localhost:7120. Please verify your backend server is running and HTTPS certificate is accepted.'
        );
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during login.');
  }
}
