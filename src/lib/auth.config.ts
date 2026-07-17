import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible Auth.js configuration.
 *
 * This file contains the Auth.js configuration that does NOT rely on Node.js
 * specific modules like Mongoose or bcryptjs. It is safe to import into the
 * Next.js Edge middleware.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [], // Providers (e.g., Credentials) are added in auth.ts
} satisfies NextAuthConfig;
