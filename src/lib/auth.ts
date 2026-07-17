import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import dbConnect from '@/lib/db';
import User from '@/features/users/models/user.model';
import Role from '@/features/roles/models/role.model';
import bcrypt from 'bcryptjs';

/**
 * Node.js-compatible Auth.js configuration.
 *
 * This file contains the providers and database callbacks.
 * It is used by the API routes and Server Components.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email })
          .select('+password')
          .lean();

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (user.status !== 'active') {
          throw new Error('Account is suspended or inactive');
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar || null,
          roleId: user.roleId.toString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleId = (user as Record<string, unknown>).roleId as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;

        try {
          await dbConnect();
          const role = await Role.findById(token.roleId).lean();
          if (role) {
            session.user.role = {
              id: role._id.toString(),
              name: role.name,
              permissions: role.permissions,
            };
          }
        } catch {
          // If role lookup fails, attach minimal role info
          session.user.role = {
            id: token.roleId as string,
            name: 'unknown',
            permissions: [],
          };
        }
      }
      return session;
    },
  },
});
