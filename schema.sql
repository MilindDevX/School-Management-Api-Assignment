-- School Management Database Schema
-- Run this file to initialize the database

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT         NOT NULL,
  longitude   FLOAT         NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_name (name),
  INDEX idx_coordinates (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Greenwood High School',   '123 Elm Street, New York, NY 10001',         40.7128, -74.0060),
  ('Sunrise Academy',         '456 Oak Avenue, Los Angeles, CA 90001',       34.0522, -118.2437),
  ('Lakeside Middle School',  '789 Pine Road, Chicago, IL 60601',            41.8781, -87.6298),
  ('Riverdale Primary',       '321 Maple Drive, Houston, TX 77001',          29.7604, -95.3698),
  ('Hilltop International',   '654 Birch Blvd, Phoenix, AZ 85001',          33.4484, -112.0740),
  ('Westview Elementary',     '987 Cedar Lane, Philadelphia, PA 19101',      39.9526,  -75.1652),
  ('Northgate Academy',       '741 Willow Way, San Antonio, TX 78201',       29.4241,  -98.4936),
  ('Eastfield School',        '852 Spruce Ct, San Diego, CA 92101',          32.7157, -117.1611),
  ('Southbrook College Prep', '963 Ash Street, Dallas, TX 75201',            32.7767,  -96.7970),
  ('Central Valley School',   '159 Poplar Blvd, San Jose, CA 95101',        37.3382, -121.8863);
