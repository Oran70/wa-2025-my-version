// const fs = require('fs');
// const path = require('path');
// const { Pool } = require('pg');
// require('dotenv').config();
//
// // PostgreSQL connection configuration
// const pool = new Pool({
//     user: process.env.PG_USER || 'eleonora',
//     host: process.env.PG_HOST || 'localhost',
//     database: process.env.PG_NAME || 'eduplandb_dev',
//     password: process.env.PG_PASSWORD || 'postgres',
//     port: process.env.PG_PORT || 5432,
// });
//
// async function setupDatabase() {
//     let client;
//     try {
//         // Connect to the database
//         client = await pool.connect();
//         console.log('Connected to PostgreSQL. Setting up the database...');
//
//         // Read the SQL schema file
//         let schemaSQL = fs.readFileSync(
//             path.join(__dirname, 'db', 'schema.sql'),
//             'utf8'
//         );
//
//         // Clean up the SQL - replace smart quotes and other problematic characters
//         schemaSQL = schemaSQL
//             .replace(/[""]/g, '"')  // Replace smart quotes with regular quotes
//             .replace(/['']/g, "'")  // Replace smart apostrophes with regular apostrophes
//             .replace(/–/g, '-')     // Replace en-dash with regular dash
//             .replace(/—/g, '--')    // Replace em-dash with double dash
//             .trim();
//
//         // Execute the entire schema as one transaction
//         await client.query('BEGIN');
//
//         try {
//             await client.query(schemaSQL);
//             console.log('✓ Schema created successfully');
//
//             // If functions.sql exists, execute it
//             const functionsPath = path.join(__dirname, 'db', 'functions.sql');
//             if (fs.existsSync(functionsPath)) {
//                 console.log('Executing functions and triggers...');
//                 const functionsSQL = fs.readFileSync(functionsPath, 'utf8');
//                 await client.query(functionsSQL);
//                 console.log('✓ Functions and triggers created successfully');
//             }
//
//             await client.query('COMMIT');
//             console.log('✓ Database setup completed successfully!');
//         } catch (error) {
//             await client.query('ROLLBACK');
//             throw error;
//         }
//
//     } catch (error) {
//         console.error('Error setting up the database:', error);
//
//         // Try to give more specific error information
//         if (error.position) {
//             console.error(`Error at position ${error.position} in the SQL file`);
//         }
//
//         if (error.message.includes('does not exist')) {
//             console.error('\n🔍 This appears to be a table dependency issue.');
//             console.error('Make sure tables are created in the correct order (dependencies first).');
//         }
//
//         process.exit(1);
//     } finally {
//         if (client) {
//             client.release();
//         }
//         // Close the pool
//         await pool.end();
//     }
// }
//
// // Alternative function to setup database step by step (useful for debugging)
// async function setupDatabaseStepByStep() {
//     let client;
//     try {
//         client = await pool.connect();
//         console.log('Connected to PostgreSQL. Setting up the database step by step...');
//
//         await client.query('BEGIN');
//
//         // Step 1: Enable UUID extension
//         console.log('1. Enabling UUID extension...');
//         await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
//
//         // Step 2: Drop existing tables (in reverse dependency order)
//         console.log('2. Dropping existing tables...');
//         const dropStatements = [
//             'DROP TABLE IF EXISTS log CASCADE',
//             'DROP TABLE IF EXISTS appointment CASCADE',
//             'DROP TABLE IF EXISTS availability CASCADE',
//             'DROP TABLE IF EXISTS teacher_class CASCADE',
//             'DROP TABLE IF EXISTS student CASCADE',
//             'DROP TABLE IF EXISTS class CASCADE',
//             'DROP TABLE IF EXISTS level CASCADE',
//             'DROP TABLE IF EXISTS user_role CASCADE',
//             'DROP TABLE IF EXISTS role CASCADE',
//             'DROP TABLE IF EXISTS "user" CASCADE'
//         ];
//
//         for (const stmt of dropStatements) {
//             await client.query(stmt);
//         }
//
//         // Step 3: Create tables in dependency order
//         console.log('3. Creating tables...');
//
//         // Create role table (no dependencies)
//         console.log('   Creating role table...');
//         await client.query(`
//             CREATE TABLE "role" (
//                 role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 name VARCHAR(50) NOT NULL UNIQUE,
//                 description TEXT
//             )
//         `);
//
//         // Create user table (no dependencies)
//         console.log('   Creating user table...');
//         await client.query(`
//             CREATE TABLE "user" (
//                 user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 email VARCHAR(255) NOT NULL UNIQUE,
//                 name VARCHAR(255) NOT NULL,
//                 password VARCHAR(255),
//                 phone VARCHAR(20),
//                 is_active BOOLEAN DEFAULT TRUE,
//                 abbreviation VARCHAR(10),
//                 notes TEXT,
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//             )
//         `);
//
//         // Create user_role table (depends on user and role)
//         console.log('   Creating user_role table...');
//         await client.query(`
//             CREATE TABLE user_role (
//                 user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
//                 role_id UUID NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
//                 UNIQUE (user_id, role_id)
//             )
//         `);
//
//         // Create level table (no dependencies)
//         console.log('   Creating level table...');
//         await client.query(`
//             CREATE TABLE level (
//                 level_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 name VARCHAR(50) NOT NULL UNIQUE,
//                 description TEXT
//             )
//         `);
//
//         // Create class table (depends on level)
//         console.log('   Creating class table...');
//         await client.query(`
//             CREATE TABLE class (
//                 class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 class_name VARCHAR(50) NOT NULL,
//                 level_id UUID NOT NULL REFERENCES level(level_id) ON DELETE RESTRICT,
//                 school_year VARCHAR(20) NOT NULL,
//                 UNIQUE (class_name, school_year)
//             )
//         `);
//
//         // Create student table (depends on level and class)
//         console.log('   Creating student table...');
//         await client.query(`
//             CREATE TABLE student (
//                 student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 student_number VARCHAR(50) UNIQUE NOT NULL,
//                 name VARCHAR(255) NOT NULL,
//                 level_id UUID NOT NULL REFERENCES level(level_id) ON DELETE RESTRICT,
//                 class_id UUID NOT NULL REFERENCES class(class_id) ON DELETE RESTRICT,
//                 parent_access_code VARCHAR(10) UNIQUE NOT NULL,
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//             )
//         `);
//
//         // Create teacher_class table (depends on user and class)
//         console.log('   Creating teacher_class table...');
//         await client.query(`
//             CREATE TABLE teacher_class (
//                 teacher_class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
//                 class_id UUID NOT NULL REFERENCES class(class_id) ON DELETE CASCADE,
//                 is_primary_mentor BOOLEAN DEFAULT FALSE,
//                 school_year VARCHAR(20) NOT NULL,
//                 UNIQUE (user_id, class_id, school_year)
//             )
//         `);
//
//         // Create availability table (depends on user)
//         console.log('   Creating availability table...');
//         await client.query(`
//             CREATE TABLE availability (
//                 availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
//                 date DATE NOT NULL,
//                 start_time TIME NOT NULL,
//                 end_time TIME NOT NULL,
//                 slot_duration INTEGER NOT NULL CHECK (slot_duration >= 10 AND slot_duration <= 30),
//                 is_visible BOOLEAN DEFAULT TRUE,
// --                 location_type VARCHAR(50) NOT NULL CHECK (location_type IN ('On-site', 'Online', 'Parent choice')),
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 CHECK (start_time < end_time)
//             )
//         `);
//
//         // Create appointment table (depends on availability, user, and student)
//         console.log('   Creating appointment table...');
//         await client.query(`
//             CREATE TABLE appointment (
//                 appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 availability_id UUID NOT NULL REFERENCES availability(availability_id) ON DELETE RESTRICT,
//                 teacher_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE RESTRICT,
//                 student_id UUID NOT NULL REFERENCES student(student_id) ON DELETE RESTRICT,
//                 parent_name VARCHAR(255) NOT NULL,
//                 parent_email VARCHAR(255) NOT NULL,
//                 parent_phone VARCHAR(20),
//                 date DATE NOT NULL,
//                 start_time TIME NOT NULL,
//                 end_time TIME NOT NULL,
//                 status VARCHAR(20) NOT NULL CHECK (status IN ('Scheduled', 'Cancelled')) DEFAULT 'Scheduled',
// --                 location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('On-site', 'Online')),
//                 cancellation_datetime TIMESTAMP WITH TIME ZONE,
//                 cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('Parent', 'Teacher')),
//                 cancellation_reason TEXT,
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 CHECK (start_time < end_time)
//             )
//         `);
//
//         // Create log table (depends on user, but allows null)
//         console.log('   Creating log table...');
//         await client.query(`
//             CREATE TABLE log (
//                 log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//                 user_id UUID REFERENCES "user"(user_id) ON DELETE SET NULL,
//                 action VARCHAR(255) NOT NULL,
//                 entity_type VARCHAR(50) NOT NULL,
//                 entity_id UUID,
//                 details JSONB,
//                 ip_address VARCHAR(50),
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//             )
//         `);
//
//         // Create indexes
//         console.log('4. Creating indexes...');
//         const indexes = [
//             'CREATE INDEX idx_user_email ON "user"(email)',
//             'CREATE INDEX idx_user_role_user_id ON user_role(user_id)',
//             'CREATE INDEX idx_user_role_role_id ON user_role(role_id)',
//             'CREATE INDEX idx_student_level_id ON student(level_id)',
//             'CREATE INDEX idx_student_class_id ON student(class_id)',
//             'CREATE INDEX idx_student_number ON student(student_number)',
//             'CREATE INDEX idx_student_access_code ON student(parent_access_code)',
//             'CREATE INDEX idx_class_level_id ON class(level_id)',
//             'CREATE INDEX idx_teacher_class_user_id ON teacher_class(user_id)',
//             'CREATE INDEX idx_teacher_class_class_id ON teacher_class(class_id)',
//             'CREATE INDEX idx_availability_user_id ON availability(user_id)',
//             'CREATE INDEX idx_availability_date ON availability(date)',
//             'CREATE INDEX idx_appointment_availability_id ON appointment(availability_id)',
//             'CREATE INDEX idx_appointment_teacher_id ON appointment(teacher_id)',
//             'CREATE INDEX idx_appointment_student_id ON appointment(student_id)',
//             'CREATE INDEX idx_appointment_parent_email ON appointment(parent_email)',
//             'CREATE INDEX idx_appointment_date ON appointment(date)',
//             'CREATE INDEX idx_appointment_status ON appointment(status)',
//             'CREATE INDEX idx_log_user_id ON log(user_id)',
//             'CREATE INDEX idx_log_entity_type_id ON log(entity_type, entity_id)'
//         ];
//
//         for (const index of indexes) {
//             await client.query(index);
//         }
//
//         // Insert initial data
//         console.log('5. Inserting initial data...');
//
//         // Insert roles
//         await client.query(`
//             INSERT INTO role (name, description) VALUES
//                 ('Administrator', 'System administrator with full access to all features'),
//                 ('Mentor', 'Teacher who serves as a mentor for students'),
//                 ('Dean', 'Teacher with administrative responsibilities'),
//                 ('TeamLeader', 'Leader of a group of teachers'),
//                 ('TeacherSubject', 'Subject teacher')
//         `);
//
//         // Insert levels
//         await client.query(`
//             INSERT INTO level (name, description) VALUES
//                 ('MAVO', 'Middelbaar Algemeen Voortgezet Onderwijs'),
//                 ('HAVO', 'Hoger Algemeen Voortgezet Onderwijs'),
//                 ('VWO', 'Voorbereidend Wetenschappelijk Onderwijs')
//         `);
//
//         await client.query('COMMIT');
//         console.log('✓ Database setup completed successfully!');
//
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Error setting up the database:', error);
//         process.exit(1);
//     } finally {
//         if (client) {
//             client.release();
//         }
//         await pool.end();
//     }
// }
//
// // Check command line arguments
// const args = process.argv.slice(2);
//
// if (args.includes('--step-by-step') || args.includes('-s')) {
//     console.log('Running step-by-step setup...');
//     setupDatabaseStepByStep().then(() => {
//         console.log('Database setup script executed successfully.');
//     }).catch(err => {
//         console.error('Error executing database setup script:', err);
//     });
// } else {
//     console.log('Running normal setup...');
//     setupDatabase().then(() => {
//         console.log('Database setup script executed successfully.');
//     }).catch(err => {
//         console.error('Error executing database setup script:', err);
//     });
// }
