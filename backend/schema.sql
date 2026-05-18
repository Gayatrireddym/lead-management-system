-- Lead Management System - Database Schema
-- Run this file to initialize your PostgreSQL database

CREATE DATABASE lead_crm;

\c lead_crm;

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
  status VARCHAR(20) NOT NULL DEFAULT 'Interested' CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: seed some sample data
INSERT INTO leads (name, phone, source, status) VALUES
  ('Rahul Sharma', '9876543210', 'Call', 'Interested'),
  ('Priya Patel', '9123456789', 'WhatsApp', 'Converted'),
  ('Anil Kumar', '9988776655', 'Field', 'Not Interested');
