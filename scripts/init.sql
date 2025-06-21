-- init.sql

DROP TABLE IF EXISTS user_area CASCADE;
DROP TABLE IF EXISTS elements CASCADE;
DROP TABLE IF EXISTS element_types CASCADE;
DROP TABLE IF EXISTS areas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create extension to support UUIDs, if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table with UUID as primary key
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(511) UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- Create the areas table with UUID as primary key
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  owner_id UUID NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create the user to area relation table with UUID as primary key
CREATE TABLE IF NOT EXISTS user_area (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  area_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Create the table for every type an element can be with numeric ID as primary key
CREATE TABLE IF NOT EXISTS element_types (
  id INT PRIMARY KEY,
  title VARCHAR(255)
);

-- Create the tasks table with UUID as primary key
CREATE TABLE IF NOT EXISTS elements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_id INT NOT NULL,
  area_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  title VARCHAR(255),
  details VARCHAR(2047),
  position_x INT DEFAULT 0,
  position_y INT DEFAULT 0,
  deadline TIMESTAMP DEFAULT NULL,
  finished_at TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES element_types(id),
  FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Insert test users
INSERT INTO users (username, email, password)
VALUES
  ('alice', 'alice@example.com', 'hashedpassword1'),
  ('bob', 'bob@example.com', 'hashedpassword2'),
  ('charlie', 'charlie@example.com', 'hashedpassword3');

-- Insert test areas
INSERT INTO areas (title, description, owner_id, is_private)
VALUES
  ('Work Projects', 'Tasks related to work and projects', (SELECT id FROM users WHERE username = 'alice'), false),
  ('Personal Goals', 'My personal development goals', (SELECT id FROM users WHERE username = 'bob'), true),
  ('University', 'University tasks and deadlines', (SELECT id FROM users WHERE username = 'charlie'), false);

-- Insert user_area relations
INSERT INTO user_area (user_id, area_id)
VALUES
  ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM areas WHERE title = 'Work Projects')),
  ((SELECT id FROM users WHERE username = 'bob'), (SELECT id FROM areas WHERE title = 'Personal Goals')),
  ((SELECT id FROM users WHERE username = 'charlie'), (SELECT id FROM areas WHERE title = 'University')),
  -- Example of shared area
  ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM areas WHERE title = 'University'));

-- Insert element types with numeric IDs
INSERT INTO element_types (id, title)
VALUES
  (0, 'post-it'),
  (1, 'tier list'),
  (2, 'calendar'),
  (3, 'shapes'),
  (4, 'box'),
  (5, 'circle');

-- Insert elements into 'Work Projects' area (example)
INSERT INTO elements (type_id, area_id, title, details, deadline, finished_at)
VALUES
  (
    (SELECT id FROM element_types WHERE title = 'post-it'),
    (SELECT id FROM areas WHERE title = 'Work Projects'),
    'Finish presentation',
    'Complete the slides for Monday meeting',
    NOW() + INTERVAL '3 days',
    NULL
  ),
  (
    (SELECT id FROM element_types WHERE title = 'calendar'),
    (SELECT id FROM areas WHERE title = 'Work Projects'),
    'Project deadlines',
    'Mark all key project dates',
    NOW() + INTERVAL '10 days',
    NULL
  );

-- Insert elements into 'University' area (example)
INSERT INTO elements (type_id, area_id, title, details, deadline, finished_at)
VALUES
  (
    (SELECT id FROM element_types WHERE title = 'post-it'),
    (SELECT id FROM areas WHERE title = 'University'),
    'Study for math exam',
    'Review chapters 4 to 7',
    NOW() + INTERVAL '7 days',
    NULL
  );

-- Insert elements into 'Personal Goals' area (example)
INSERT INTO elements (type_id, area_id, title, details, deadline, finished_at)
VALUES
  (
    (SELECT id FROM element_types WHERE title = 'tier list'),
    (SELECT id FROM areas WHERE title = 'Personal Goals'),
    'Fitness progress',
    'Rank weekly workout achievements',
    NULL,
    NULL
  );
