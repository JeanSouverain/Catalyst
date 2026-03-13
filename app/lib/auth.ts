import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUser } from './user-db';

async function getUserFromDb(email: string): Promise<any | undefined> {
  try {
    // Try database first
    const user = await getUser(email);
    if (user) {
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      };
    }
  } catch (error) {
    console.warn('Database not available, using fallback authentication');
  }

  // Fallback to in-memory users for development
  const fallbackUsers = [
    {
      id: '1',
      email: 'admin@example.com',
      password: '$2b$10$o67ERSLYyRBlH3P4XQw3YuSoXtUtCzn0AehEVZNDELvOUa1ffQW/S', // hashed 'admin123'
      name: 'Admin User',
    },
  ];

  const fallbackUser = fallbackUsers.find((user) => user.email === email);
  if (fallbackUser) {
    return {
      id: fallbackUser.id,
      name: fallbackUser.name,
      email: fallbackUser.email,
    };
  }

  return null;
}

async function validatePassword(email: string, password: string): Promise<boolean> {
  try {
    // Try database first
    const user = await getUser(email);
    if (user) {
      return await bcrypt.compare(password, user.password);
    }
  } catch (error) {
    console.warn('Database not available, using fallback authentication');
  }

  // Fallback to in-memory users
  const fallbackUsers = [
    {
      id: '1',
      email: 'admin@example.com',
      password: '$2b$10$o67ERSLYyRBlH3P4XQw3YuSoXtUtCzn0AehEVZNDELvOUa1ffQW/S', // hashed 'admin123'
      name: 'Admin User',
    },
  ];

  const fallbackUser = fallbackUsers.find((user) => user.email === email);
  if (fallbackUser) {
    return await bcrypt.compare(password, fallbackUser.password);
  }

  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Validate password
          const isValid = await validatePassword(email, password);
          if (isValid) {
            return await getUserFromDb(email);
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});