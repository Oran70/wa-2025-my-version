-- Create database (run this if you haven't created the database yet)
-- CREATE DATABASE eduplandb;

-- Connect to the database
-- \c eduplandb

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- Drop tables if they exist (for clean reinstallation)
-- DROP TABLE IF EXISTS log;
-- DROP TABLE IF EXISTS appointment;
-- DROP TABLE IF EXISTS availability;
-- DROP TABLE IF EXISTS teacher_class;
-- DROP TABLE IF EXISTS parent_student;
-- DROP TABLE IF EXISTS student;
-- DROP TABLE IF EXISTS class;
-- DROP TABLE IF EXISTS level;
-- DROP TABLE IF EXISTS user_role;
-- DROP TABLE IF EXISTS role;
-- DROP TABLE IF EXISTS "user";

-- Create tables with UUID primary keys
CREATE TABLE "role" (
                        role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name VARCHAR(50) NOT NULL UNIQUE,
                        description TEXT
);

CREATE TABLE "user" (
                        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        email VARCHAR(255) NOT NULL UNIQUE,
                        name VARCHAR(255) NOT NULL,
                        password VARCHAR(255),
                        phone VARCHAR(20),
                        is_active BOOLEAN DEFAULT TRUE,
                        abbreviation VARCHAR(10),
                        notes TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_role (
                           user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
                           role_id UUID NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
                           UNIQUE (user_id, role_id)
);

CREATE TABLE level (
                       level_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description TEXT
);

CREATE TABLE class (
                       class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       class_name VARCHAR(50) NOT NULL,
                       level_id UUID NOT NULL REFERENCES level(level_id) ON DELETE RESTRICT,
                       school_year VARCHAR(20) NOT NULL,
                       UNIQUE (class_name, school_year)
);

-- Student table with access code generation
CREATE TABLE student (
                         student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         student_number VARCHAR(50) UNIQUE NOT NULL,
                         name VARCHAR(255) NOT NULL,
                         level_id UUID NOT NULL REFERENCES level(level_id) ON DELETE RESTRICT,
                         class_id UUID NOT NULL REFERENCES class(class_id) ON DELETE RESTRICT,
    -- This is the access code that parents will use
                         parent_access_code VARCHAR(10) UNIQUE NOT NULL,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE availability (
                              availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
                              date DATE NOT NULL,
                              start_time TIME NOT NULL,
                              end_time TIME NOT NULL,
                              slot_duration INTEGER NOT NULL CHECK (slot_duration >= 10 AND slot_duration <= 30), -- in minutes
                              is_visible BOOLEAN DEFAULT TRUE,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              CHECK (start_time < end_time) -- Ensure start time is before end time
);

-- Parent information will be stored when they make appointments (no separate user record needed)
CREATE TABLE appointment (
                             appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             availability_id UUID NOT NULL REFERENCES availability(availability_id) ON DELETE RESTRICT,
                             teacher_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE RESTRICT,
                             student_id UUID NOT NULL REFERENCES student(student_id) ON DELETE RESTRICT,

    -- Parent information (captured when making appointment)
                             parent_name VARCHAR(255) NOT NULL,
                             parent_email VARCHAR(255) NOT NULL,
                             parent_phone VARCHAR(20),

                             date DATE NOT NULL,
                             start_time TIME NOT NULL,
                             end_time TIME NOT NULL,
                             status VARCHAR(20) NOT NULL CHECK (status IN ('Scheduled', 'Cancelled')) DEFAULT 'Scheduled',
                             cancellation_datetime TIMESTAMP WITH TIME ZONE,
                             cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('Parent', 'Teacher')),
                             cancellation_reason TEXT,
                             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CHECK (start_time < end_time) -- Ensure start time is before end time
);

CREATE TABLE teacher_class (
                               teacher_class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
                               class_id UUID NOT NULL REFERENCES class(class_id) ON DELETE CASCADE,
                               is_primary_mentor BOOLEAN DEFAULT FALSE,
                               school_year VARCHAR(20) NOT NULL,
                               UNIQUE (user_id, class_id, school_year)
);

CREATE TABLE log (
                     log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                     user_id UUID REFERENCES "user"(user_id) ON DELETE SET NULL,
                     action VARCHAR(255) NOT NULL,
                     entity_type VARCHAR(50) NOT NULL, -- e.g., 'appointment', 'user', 'availability', 'student'
                     entity_id UUID,
                     details JSONB,
                     ip_address VARCHAR(50),
                     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role_user_id ON user_role(user_id);
CREATE INDEX idx_user_role_role_id ON user_role(role_id);
CREATE INDEX idx_student_level_id ON student(level_id);
CREATE INDEX idx_student_class_id ON student(class_id);
CREATE INDEX idx_student_number ON student(student_number);
CREATE INDEX idx_student_access_code ON student(parent_access_code);
CREATE INDEX idx_class_level_id ON class(level_id);
CREATE INDEX idx_teacher_class_user_id ON teacher_class(user_id);
CREATE INDEX idx_teacher_class_class_id ON teacher_class(class_id);
CREATE INDEX idx_availability_user_id ON availability(user_id);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_appointment_availability_id ON appointment(availability_id);
CREATE INDEX idx_appointment_teacher_id ON appointment(teacher_id);
CREATE INDEX idx_appointment_student_id ON appointment(student_id);
CREATE INDEX idx_appointment_parent_email ON appointment(parent_email);
CREATE INDEX idx_appointment_date ON appointment(date);
CREATE INDEX idx_appointment_status ON appointment(status);
CREATE INDEX idx_log_user_id ON log(user_id);
CREATE INDEX idx_log_entity_type_id ON log(entity_type, entity_id);

-- Insert initial roles
INSERT INTO role (name, description) VALUES
                                         ('Administrator', 'System administrator with full access to all features'),
                                         ('Mentor', 'Teacher who serves as a mentor for students'),
                                         ('Dean', 'Teacher with administrative responsibilities'),
                                         ('TeamLeader', 'Leader of a group of teachers'),
                                         ('TeacherSubject', 'Subject teacher');

-- Insert education levels
INSERT INTO level (name, description) VALUES
                                          ('MAVO', 'Middelbaar Algemeen Voortgezet Onderwijs'),
                                          ('HAVO', 'Hoger Algemeen Voortgezet Onderwijs'),
                                          ('VWO', 'Voorbereidend Wetenschappelijk Onderwijs');

-- Simple function to generate 10-character access code
CREATE OR REPLACE FUNCTION generate_student_access_code()
    RETURNS VARCHAR(10) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(10) := '';
    i INTEGER;
BEGIN
    -- Generate a 10-character alphanumeric code
    FOR i IN 1..10 LOOP
            result := result || substr(chars, floor(random() * 36 + 1)::integer, 1);
        END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to automatically generate access code for students
CREATE OR REPLACE FUNCTION auto_generate_student_access_code()
    RETURNS TRIGGER AS $$
DECLARE
    access_code VARCHAR(10);
    attempts INTEGER := 0;
    max_attempts INTEGER := 100;
BEGIN
    -- Only generate if access code is not provided
    IF NEW.parent_access_code IS NULL OR NEW.parent_access_code = '' THEN
        LOOP
            attempts := attempts + 1;
            IF attempts > max_attempts THEN
                RAISE EXCEPTION 'Unable to generate unique access code after % attempts', max_attempts;
            END IF;

            access_code := generate_student_access_code();

            -- Check if code is unique
            IF NOT EXISTS(SELECT 1 FROM student WHERE parent_access_code = access_code) THEN
                NEW.parent_access_code := access_code;
                EXIT;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic access code generation
CREATE TRIGGER trigger_student_access_code
    BEFORE INSERT OR UPDATE ON student
    FOR EACH ROW
EXECUTE FUNCTION auto_generate_student_access_code();

-- Function to import student data (for administrators)
CREATE OR REPLACE FUNCTION import_student(
    p_student_number VARCHAR(50),
    p_name VARCHAR(255),
    p_level_name VARCHAR(50),
    p_class_name VARCHAR(50),
    p_school_year VARCHAR(20),
    p_access_code VARCHAR(10) DEFAULT NULL  -- Optional: provide specific code
)
    RETURNS TABLE(student_id UUID, access_code VARCHAR(10)) AS $$
DECLARE
    v_level_id UUID;
    v_class_id UUID;
    v_student_id UUID;
    v_access_code VARCHAR(10);
BEGIN
    -- Get level ID
    SELECT level.level_id INTO v_level_id FROM level WHERE name = p_level_name;
    IF v_level_id IS NULL THEN
        RAISE EXCEPTION 'Level "%" does not exist', p_level_name;
    END IF;

    -- Get or create class
    SELECT class.class_id INTO v_class_id
    FROM class
    WHERE class_name = p_class_name AND school_year = p_school_year;

    IF v_class_id IS NULL THEN
        INSERT INTO class (class_name, level_id, school_year)
        VALUES (p_class_name, v_level_id, p_school_year)
        RETURNING class.class_id INTO v_class_id;
    END IF;

    -- Insert student (trigger will generate access code if not provided)
    INSERT INTO student (student_number, name, level_id, class_id, parent_access_code)
    VALUES (p_student_number, p_name, v_level_id, v_class_id, p_access_code)
    RETURNING student.student_id, student.parent_access_code INTO v_student_id, v_access_code;

    -- Log the import
    INSERT INTO log (action, entity_type, entity_id, details)
    VALUES ('IMPORT', 'student', v_student_id,
            jsonb_build_object(
                    'student_number', p_student_number,
                    'name', p_name,
                    'level', p_level_name,
                    'class', p_class_name,
                    'access_code', v_access_code
            ));

    RETURN QUERY SELECT v_student_id, v_access_code;
END;
$$ LANGUAGE plpgsql;

-- Function to get student information by access code (for parents)
CREATE OR REPLACE FUNCTION get_student_by_access_code(p_access_code VARCHAR(10))
    RETURNS TABLE(
                     student_id UUID,
                     student_name VARCHAR(255),
                     student_number VARCHAR(50),
                     class_name VARCHAR(50),
                     level_name VARCHAR(50),
                     school_year VARCHAR(20),
                     teachers JSONB
                 ) AS $$
BEGIN
    RETURN QUERY
        SELECT
            s.student_id,
            s.name as student_name,
            s.student_number,
            c.class_name,
            l.name as level_name,
            c.school_year,
            (
                SELECT jsonb_agg(
                               jsonb_build_object(
                                       'teacher_id', u.user_id,
                                       'teacher_name', u.name,
                                       'abbreviation', u.abbreviation,
                                       'is_primary_mentor', tc.is_primary_mentor
                               )
                       )
                FROM teacher_class tc
                         JOIN "user" u ON tc.user_id = u.user_id
                WHERE tc.class_id = s.class_id
                  AND tc.school_year = c.school_year
            ) as teachers
        FROM student s
                 JOIN class c ON s.class_id = c.class_id
                 JOIN level l ON s.level_id = l.level_id
        WHERE s.parent_access_code = p_access_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create appointment (for parents)
CREATE OR REPLACE FUNCTION create_appointment(
    p_access_code VARCHAR(10),
    p_teacher_id UUID,
    p_availability_id UUID,
    p_parent_name VARCHAR(255),
    p_parent_email VARCHAR(255),
    p_parent_phone VARCHAR(20),
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME
)
    RETURNS UUID AS $$
DECLARE
    v_student_id UUID;
    v_appointment_id UUID;
BEGIN
    -- Get student ID from access code
    SELECT student_id INTO v_student_id
    FROM student
    WHERE parent_access_code = p_access_code;

    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Invalid access code';
    END IF;

    -- Verify availability exists and is available
    IF NOT EXISTS (
        SELECT 1 FROM availability
        WHERE availability_id = p_availability_id
          AND user_id = p_teacher_id
          AND is_visible = TRUE
    ) THEN
        RAISE EXCEPTION 'Availability slot not found or not available';
    END IF;

    -- Create appointment
    INSERT INTO appointment (
        availability_id, teacher_id, student_id,
        parent_name, parent_email, parent_phone,
        date, start_time, end_time
    ) VALUES (
                 p_availability_id, p_teacher_id, v_student_id,
                 p_parent_name, p_parent_email, p_parent_phone,
                 p_date, p_start_time, p_end_time
             ) RETURNING appointment_id INTO v_appointment_id;

    -- Log the appointment creation
    INSERT INTO log (action, entity_type, entity_id, details)
    VALUES ('CREATE', 'appointment', v_appointment_id,
            jsonb_build_object(
                    'student_id', v_student_id,
                    'teacher_id', p_teacher_id,
                    'parent_email', p_parent_email,
                    'date', p_date,
                    'start_time', p_start_time
            ));

    RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON "user"
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_student_modtime
    BEFORE UPDATE ON student
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_availability_modtime
    BEFORE UPDATE ON availability
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_appointment_modtime
    BEFORE UPDATE ON appointment
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Function to cleanup data for a specific school year
CREATE OR REPLACE FUNCTION cleanup_school_year_data(year_to_delete VARCHAR(20))
    RETURNS VOID AS $$
BEGIN
    -- Delete appointments for classes in the specified school year
    DELETE FROM appointment a
        USING student s, class c
    WHERE a.student_id = s.student_id
      AND s.class_id = c.class_id
      AND c.school_year = year_to_delete;

    -- Delete availabilities for teachers in the specified school year
    DELETE FROM availability av
        USING teacher_class tc
    WHERE av.user_id = tc.user_id
      AND tc.school_year = year_to_delete;

    -- Remove teacher-class relationships for the specified school year
    DELETE FROM teacher_class
    WHERE school_year = year_to_delete;

    -- Delete students in classes for the specified school year
    DELETE FROM student s
        USING class c
    WHERE s.class_id = c.class_id
      AND c.school_year = year_to_delete;

    -- Delete classes for the specified school year
    DELETE FROM class
    WHERE school_year = year_to_delete;

    -- Log the cleanup operation
    INSERT INTO log (action, entity_type, entity_id, details)
    VALUES ('CLEANUP', 'school_year', NULL,
            jsonb_build_object('school_year', year_to_delete,
                               'cleaned_at', CURRENT_TIMESTAMP));
END;
$$ LANGUAGE plpgsql;

-- Example usage for administrators:
/*
-- Import student data (access code generated automatically)
SELECT * FROM import_student('2024001', 'John Doe', 'HAVO', '3A', '2024-2025');

-- Import student with specific access code
SELECT * FROM import_student('2024002', 'Jane Smith', 'VWO', '4B', '2024-2025', 'ABC1234567');

-- Parents can use access code to get student info
SELECT * FROM get_student_by_access_code('ABC1234567');

-- Parents can create appointments
SELECT create_appointment(
    'ABC1234567',                    -- access code
    'teacher-uuid-here',             -- teacher ID
    'availability-uuid-here',        -- availability ID
    'Parent Name',                   -- parent name
    'parent@email.com',              -- parent email
    '+31612345678',                  -- parent phone
    '2024-05-25',                    -- appointment date
    '14:00',                         -- start time
    '14:30',                         -- end time
);

*/
