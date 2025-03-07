/*
  # Initial ERP System Schema

  1. New Tables
    - `companies` - Organization details
    - `users` - System users
    - `roles` - User roles and permissions
    - `user_roles` - User-role assignments
    - `departments` - Company departments
    - `employees` - Employee information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Set up role-based access control

  3. Notes
    - All tables include audit fields (created_at, updated_at)
    - UUID primary keys for better distribution
    - Foreign key constraints for referential integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  trading_name text,
  tax_id text UNIQUE,
  email text,
  phone text,
  address text,
  city text,
  state text,
  country text DEFAULT 'Brasil',
  postal_code text,
  status text DEFAULT 'active',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES departments(id),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name)
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  company_id uuid REFERENCES companies(id),
  first_name text,
  last_name text,
  avatar_url text,
  status text DEFAULT 'active',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id),
  role_id uuid REFERENCES roles(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  company_id uuid NOT NULL REFERENCES companies(id),
  department_id uuid REFERENCES departments(id),
  employee_code text,
  job_title text,
  hire_date date,
  termination_date date,
  salary numeric(15,2),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, employee_code)
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Companies policies
CREATE POLICY "Users can view their own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT company_id FROM users WHERE users.id = auth.uid()
  ));

-- Departments policies
CREATE POLICY "Users can view departments in their company"
  ON departments
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE users.id = auth.uid()
  ));

-- Users policies
CREATE POLICY "Users can view users in their company"
  ON users
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE users.id = auth.uid()
  ));

-- Employees policies
CREATE POLICY "Users can view employees in their company"
  ON employees
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE users.id = auth.uid()
  ));

-- Create default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'System Administrator', '{"all": true}'::jsonb),
  ('manager', 'Company Manager', '{"read": true, "write": true}'::jsonb),
  ('user', 'Regular User', '{"read": true, "write": false}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();