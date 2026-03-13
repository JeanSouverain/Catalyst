import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  try {
    const result = await sql<User[]>`
      INSERT INTO users (name, email, password)
      VALUES (${user.name}, ${user.email}, ${user.password})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }
}

export async function getUserById(id: number): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result[0];
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    throw new Error('Failed to fetch user by ID.');
  }
}