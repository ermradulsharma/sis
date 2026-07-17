/**
 * Authenticated user session data.
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
}

/**
 * Extended session type used by Auth.js.
 */
export interface AppSession {
  user: SessionUser;
  expires: string;
}

/**
 * Login credentials.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration payload.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Password reset request.
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Password reset with token.
 */
export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
