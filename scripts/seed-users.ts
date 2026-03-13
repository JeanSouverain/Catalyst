import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { join } from 'path';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seed() {
  try {
    console.log('Seeding database...');

    // Read and execute schema
    const schemaPath = join(process.cwd(), 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements and execute them
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

seed();