'use server';

import { signIn } from '@/app/lib/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
// Fallback users storage for development
let fallbackUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}> = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$o67ERSLYyRBlH3P4XQw3YuSoXtUtCzn0AehEVZNDELvOUa1ffQW/S', // hashed 'admin123'
  },
];

async function checkUserExists(email: string): Promise<boolean> {
  try {
    const user = await getUser(email);
    return !!user;
  } catch (error) {
    console.warn('Database not available, checking fallback users');
    return fallbackUsers.some((user) => user.email === email);
  }
}

async function createFallbackUser(user: {
  name: string;
  email: string;
  password: string;
}): Promise<{ id: string; name: string; email: string }> {
  const newUser = {
    id: Date.now().toString(),
    name: user.name,
    email: user.email,
    password: user.password,
  };

  fallbackUsers.push(newUser);
  console.log('New user registered (fallback):', { id: newUser.id, email: newUser.email, name: newUser.name });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // Basic validation
    if (!email || !password || !name) {
      return 'All fields are required.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    // Check if user already exists
    const userExists = await checkUserExists(email);
    if (userExists) {
      return 'User with this email already exists.';
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Try database first
      await createUser({
        name,
        email,
        password: hashedPassword,
      });
      console.log('New user registered in database:', { email, name });
    } catch (error) {
      console.warn('Database not available, using fallback registration');
      // Use fallback storage
      await createFallbackUser({
        name,
        email,
        password: hashedPassword,
      });
    }

    // Auto-login after registration
    await signIn('credentials', { email, password, redirect: false });

    // Redirect to dashboard on success
    redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    return 'Something went wrong during registration.';
  }
}