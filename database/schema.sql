-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert the default admin user
INSERT INTO users (name, email, password)
VALUES ('Admin User', 'admin@example.com', '$2b$10$8K1p/5w6YgQ8K1p/5w6YgQ8K1p/5w6YgQ8K1p/5w6YgQ8K1p/5w6Yg')
ON CONFLICT (email) DO NOTHING;