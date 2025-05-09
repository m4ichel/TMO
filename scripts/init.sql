-- init.sql

-- Create extension to support UUIDs, if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table with UUID as primary key
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(511) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
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

-- Create the table for every type an element can be with UUID as primary key (arrow, box, circle, post-it, calendar, etc)
CREATE TABLE IF NOT EXISTS element_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255)
);

-- Create the elements table with UUID as primary key
CREATE TABLE IF NOT EXISTS elements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_id UUID NOT NULL,
  area_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (type_id) REFERENCES element_types(id),
  FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Insert 20 users with random names and emails
INSERT INTO users (username, email)
VALUES 
  ('Alice Smith', 'alice.smith@example.com'),
  ('Bob Johnson', 'bob.johnson@example.com'),
  ('Carol Williams', 'carol.williams@example.com'),
  ('David Jones', 'david.jones@example.com'),
  ('Emma Brown', 'emma.brown@example.com'),
  ('Frank Davis', 'frank.davis@example.com'),
  ('Grace Wilson', 'grace.wilson@example.com'),
  ('Henry Moore', 'henry.moore@example.com'),
  ('Isabela Gomes', 'isabela.gomes@example.com'),
  ('Jack Lee', 'jack.lee@example.com'),
  ('Kate Clark', 'kate.clark@example.com'),
  ('Liam Martinez', 'liam.martinez@example.com'),
  ('Mia Rodriguez', 'mia.rodriguez@example.com'),
  ('Noah Garcia', 'noah.garcia@example.com'),
  ('Olivia Hernandez', 'olivia.hernandez@example.com'),
  ('Patrick Martinez', 'patrick.martinez@example.com'),
  ('Quinn Lopez', 'quinn.lopez@example.com'),
  ('Rose Thompson', 'rose.thompson@example.com'),
  ('Samuel Perez', 'samuel.perez@example.com'),
  ('Tara Scott', 'tara.scott@example.com'),
  ('Ulises Anderson', 'ulises.anderson@example.com'),
  ('Valentina White', 'valentina.white@example.com'),
  ('Walter Holland', 'walter.holland@example.com'),
  ('Xavier Renegade', 'xavier.renegade@example.com'),
  ('Yelena Davidson', 'yelena.davidson@example.com'),
  ('Zelda Hyrule', 'zelda.hyrule@example.com');