-- Database Populatie Script voor EduPlan Systeem
-- Voer dit uit nadat je migratie succesvol is voltooid

-- Voeg initiële rollen toe (als deze nog niet bestaan)
INSERT INTO role (name, description) VALUES
    ('Administrator', 'Systeembeheerder met volledige toegang tot alle functies'),
    ('Mentor', 'Docent die optreedt als mentor voor leerlingen'),
    ('Dean', 'Docent met administratieve verantwoordelijkheden'),
    ('TeamLeader', 'Leider van een groep docenten'),
    ('TeacherSubject', 'Vakdocent')
ON CONFLICT (name) DO NOTHING;

-- Voeg onderwijsniveaus toe (als deze nog niet bestaan)
INSERT INTO level (name, description) VALUES
    ('MAVO', 'Middelbaar Algemeen Voortgezet Onderwijs'),
    ('HAVO', 'Hoger Algemeen Voortgezet Onderwijs'),
    ('VWO', 'Voorbereidend Wetenschappelijk Onderwijs')
ON CONFLICT (name) DO NOTHING;

-- Voeg voorbeeldgebruikers toe (docenten en beheerders)
INSERT INTO "user" (email, name, password, phone, is_active, abbreviation, notes) VALUES
    ('admin@school.nl', 'Systeembeheerder', '$2b$10$hashedpassword1', '+31612345678', true, 'ADMIN', 'Hoofdsysteembeheerder'),
    ('j.smit@school.nl', 'Jan Smit', '$2b$10$hashedpassword2', '+31612345679', true, 'JS', 'Wiskundedocent en mentor'),
    ('m.jansen@school.nl', 'Maria Jansen', '$2b$10$hashedpassword3', '+31612345680', true, 'MJ', 'Engelse docent'),
    ('p.van.berg@school.nl', 'Pieter van den Berg', '$2b$10$hashedpassword4', '+31612345681', true, 'PVB', 'Natuurkundedocent en teamleider'),
    ('s.de.wit@school.nl', 'Sandra de Wit', '$2b$10$hashedpassword5', '+31612345682', true, 'SDW', 'Geschiedenisdocent en decaan'),
    ('r.bakker@school.nl', 'Robert Bakker', '$2b$10$hashedpassword6', '+31612345683', true, 'RB', 'Gymnastiekdocent'),
    ('l.van.dijk@school.nl', 'Linda van Dijk', '$2b$10$hashedpassword7', '+31612345684', true, 'LVD', 'Beeldende vorming docent'),
    ('t.mulder@school.nl', 'Tom Mulder', '$2b$10$hashedpassword8', '+31612345685', true, 'TM', 'Biologiedocent'),
    ('a.visser@school.nl', 'Anne Visser', '$2b$10$hashedpassword9', '+31612345686', true, 'AV', 'Nederlandse docent en mentor'),
    ('d.koning@school.nl', 'Dirk Koning', '$2b$10$hashedpassword10', '+31612345687', true, 'DK', 'Scheikunde docent')
ON CONFLICT (email) DO NOTHING;

-- Verkrijg user IDs voor rolletoewijzing
DO $$
DECLARE
    admin_user_id UUID;
    jan_user_id UUID;
    maria_user_id UUID;
    pieter_user_id UUID;
    sandra_user_id UUID;
    robert_user_id UUID;
    linda_user_id UUID;
    tom_user_id UUID;
    anne_user_id UUID;
    dirk_user_id UUID;
    
    admin_role_id UUID;
    mentor_role_id UUID;
    dean_role_id UUID;
    teamleader_role_id UUID;
    teacher_role_id UUID;
BEGIN
    -- Haal user IDs op
    SELECT user_id INTO admin_user_id FROM "user" WHERE email = 'admin@school.nl';
    SELECT user_id INTO jan_user_id FROM "user" WHERE email = 'j.smit@school.nl';
    SELECT user_id INTO maria_user_id FROM "user" WHERE email = 'm.jansen@school.nl';
    SELECT user_id INTO pieter_user_id FROM "user" WHERE email = 'p.van.berg@school.nl';
    SELECT user_id INTO sandra_user_id FROM "user" WHERE email = 's.de.wit@school.nl';
    SELECT user_id INTO robert_user_id FROM "user" WHERE email = 'r.bakker@school.nl';
    SELECT user_id INTO linda_user_id FROM "user" WHERE email = 'l.van.dijk@school.nl';
    SELECT user_id INTO tom_user_id FROM "user" WHERE email = 't.mulder@school.nl';
    SELECT user_id INTO anne_user_id FROM "user" WHERE email = 'a.visser@school.nl';
    SELECT user_id INTO dirk_user_id FROM "user" WHERE email = 'd.koning@school.nl';
    
    -- Haal role IDs op
    SELECT role_id INTO admin_role_id FROM role WHERE name = 'Administrator';
    SELECT role_id INTO mentor_role_id FROM role WHERE name = 'Mentor';
    SELECT role_id INTO dean_role_id FROM role WHERE name = 'Dean';
    SELECT role_id INTO teamleader_role_id FROM role WHERE name = 'TeamLeader';
    SELECT role_id INTO teacher_role_id FROM role WHERE name = 'TeacherSubject';
    
    -- Wijs rollen toe aan gebruikers
    INSERT INTO user_role (user_id, role_id) VALUES
        (admin_user_id, admin_role_id),
        (jan_user_id, mentor_role_id),
        (jan_user_id, teacher_role_id),
        (maria_user_id, teacher_role_id),
        (pieter_user_id, teamleader_role_id),
        (pieter_user_id, teacher_role_id),
        (sandra_user_id, dean_role_id),
        (sandra_user_id, teacher_role_id),
        (robert_user_id, teacher_role_id),
        (linda_user_id, teacher_role_id),
        (tom_user_id, teacher_role_id),
        (anne_user_id, mentor_role_id),
        (anne_user_id, teacher_role_id),
        (dirk_user_id, teacher_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
END $$;

-- Voeg klassen toe voor schooljaar 2024-2025
DO $$
DECLARE
    mavo_level_id UUID;
    havo_level_id UUID;
    vwo_level_id UUID;
BEGIN
    -- Haal level IDs op
    SELECT level_id INTO mavo_level_id FROM level WHERE name = 'MAVO';
    SELECT level_id INTO havo_level_id FROM level WHERE name = 'HAVO';
    SELECT level_id INTO vwo_level_id FROM level WHERE name = 'VWO';
    
    -- Voeg klassen toe
    INSERT INTO class (class_name, level_id, school_year) VALUES
        -- MAVO klassen
        ('1A', mavo_level_id, '2024-2025'),
        ('1B', mavo_level_id, '2024-2025'),
        ('2A', mavo_level_id, '2024-2025'),
        ('2B', mavo_level_id, '2024-2025'),
        ('3A', mavo_level_id, '2024-2025'),
        ('3B', mavo_level_id, '2024-2025'),
        ('4A', mavo_level_id, '2024-2025'),
        ('4B', mavo_level_id, '2024-2025'),
        
        -- HAVO klassen
        ('1C', havo_level_id, '2024-2025'),
        ('1D', havo_level_id, '2024-2025'),
        ('2C', havo_level_id, '2024-2025'),
        ('2D', havo_level_id, '2024-2025'),
        ('3C', havo_level_id, '2024-2025'),
        ('3D', havo_level_id, '2024-2025'),
        ('4C', havo_level_id, '2024-2025'),
        ('4D', havo_level_id, '2024-2025'),
        ('5C', havo_level_id, '2024-2025'),
        ('5D', havo_level_id, '2024-2025'),
        
        -- VWO klassen
        ('1E', vwo_level_id, '2024-2025'),
        ('1F', vwo_level_id, '2024-2025'),
        ('2E', vwo_level_id, '2024-2025'),
        ('2F', vwo_level_id, '2024-2025'),
        ('3E', vwo_level_id, '2024-2025'),
        ('3F', vwo_level_id, '2024-2025'),
        ('4E', vwo_level_id, '2024-2025'),
        ('4F', vwo_level_id, '2024-2025'),
        ('5E', vwo_level_id, '2024-2025'),
        ('5F', vwo_level_id, '2024-2025'),
        ('6E', vwo_level_id, '2024-2025'),
        ('6F', vwo_level_id, '2024-2025')
    ON CONFLICT (class_name, school_year) DO NOTHING;
END $$;

-- Wijs docenten toe aan klassen (mentoren en vakdocenten)
DO $$
DECLARE
    jan_user_id UUID;
    maria_user_id UUID;
    pieter_user_id UUID;
    sandra_user_id UUID;
    robert_user_id UUID;
    linda_user_id UUID;
    tom_user_id UUID;
    anne_user_id UUID;
    dirk_user_id UUID;
    
    class_1a_id UUID;
    class_1b_id UUID;
    class_2a_id UUID;
    class_2b_id UUID;
    class_3a_id UUID;
    class_3b_id UUID;
    class_1c_id UUID;
    class_1d_id UUID;
    class_2c_id UUID;
    class_2d_id UUID;
    class_1e_id UUID;
    class_1f_id UUID;
BEGIN
    -- Haal user IDs op
    SELECT user_id INTO jan_user_id FROM "user" WHERE email = 'j.smit@school.nl';
    SELECT user_id INTO maria_user_id FROM "user" WHERE email = 'm.jansen@school.nl';
    SELECT user_id INTO pieter_user_id FROM "user" WHERE email = 'p.van.berg@school.nl';
    SELECT user_id INTO sandra_user_id FROM "user" WHERE email = 's.de.wit@school.nl';
    SELECT user_id INTO robert_user_id FROM "user" WHERE email = 'r.bakker@school.nl';
    SELECT user_id INTO linda_user_id FROM "user" WHERE email = 'l.van.dijk@school.nl';
    SELECT user_id INTO tom_user_id FROM "user" WHERE email = 't.mulder@school.nl';
    SELECT user_id INTO anne_user_id FROM "user" WHERE email = 'a.visser@school.nl';
    SELECT user_id INTO dirk_user_id FROM "user" WHERE email = 'd.koning@school.nl';
    
    -- Haal enkele class IDs op
    SELECT class_id INTO class_1a_id FROM class WHERE class_name = '1A' AND school_year = '2024-2025';
    SELECT class_id INTO class_1b_id FROM class WHERE class_name = '1B' AND school_year = '2024-2025';
    SELECT class_id INTO class_2a_id FROM class WHERE class_name = '2A' AND school_year = '2024-2025';
    SELECT class_id INTO class_2b_id FROM class WHERE class_name = '2B' AND school_year = '2024-2025';
    SELECT class_id INTO class_3a_id FROM class WHERE class_name = '3A' AND school_year = '2024-2025';
    SELECT class_id INTO class_3b_id FROM class WHERE class_name = '3B' AND school_year = '2024-2025';
    SELECT class_id INTO class_1c_id FROM class WHERE class_name = '1C' AND school_year = '2024-2025';
    SELECT class_id INTO class_1d_id FROM class WHERE class_name = '1D' AND school_year = '2024-2025';
    SELECT class_id INTO class_2c_id FROM class WHERE class_name = '2C' AND school_year = '2024-2025';
    SELECT class_id INTO class_2d_id FROM class WHERE class_name = '2D' AND school_year = '2024-2025';
    SELECT class_id INTO class_1e_id FROM class WHERE class_name = '1E' AND school_year = '2024-2025';
    SELECT class_id INTO class_1f_id FROM class WHERE class_name = '1F' AND school_year = '2024-2025';
    
    -- Wijs docenten toe aan klassen
    INSERT INTO teacher_class (user_id, class_id, is_primary_mentor, school_year) VALUES
        -- Jan Smit als mentor van 1A
        (jan_user_id, class_1a_id, true, '2024-2025'),
        -- Anne Visser als mentor van 1B
        (anne_user_id, class_1b_id, true, '2024-2025'),
        -- Maria Jansen als vakdocent voor verschillende klassen
        (maria_user_id, class_1a_id, false, '2024-2025'),
        (maria_user_id, class_1b_id, false, '2024-2025'),
        (maria_user_id, class_2a_id, false, '2024-2025'),
        -- Pieter van den Berg als vakdocent
        (pieter_user_id, class_2a_id, false, '2024-2025'),
        (pieter_user_id, class_2b_id, false, '2024-2025'),
        (pieter_user_id, class_3a_id, false, '2024-2025'),
        -- Sandra de Wit als mentor van 3A
        (sandra_user_id, class_3a_id, true, '2024-2025'),
        (sandra_user_id, class_3b_id, false, '2024-2025'),
        -- Robert Bakker als vakdocent
        (robert_user_id, class_1c_id, false, '2024-2025'),
        (robert_user_id, class_1d_id, false, '2024-2025'),
        (robert_user_id, class_2c_id, false, '2024-2025'),
        -- Linda van Dijk als vakdocent
        (linda_user_id, class_1e_id, false, '2024-2025'),
        (linda_user_id, class_1f_id, false, '2024-2025'),
        -- Tom Mulder als vakdocent
        (tom_user_id, class_2c_id, false, '2024-2025'),
        (tom_user_id, class_2d_id, false, '2024-2025'),
        -- Dirk Koning als vakdocent
        (dirk_user_id, class_1c_id, false, '2024-2025'),
        (dirk_user_id, class_1d_id, false, '2024-2025')
    ON CONFLICT (user_id, class_id, school_year) DO NOTHING;
END $$;

-- Voeg voorbeeldleerlingen toe
DO $$
DECLARE
    mavo_level_id UUID;
    havo_level_id UUID;
    vwo_level_id UUID;
    class_1a_id UUID;
    class_1b_id UUID;
    class_2a_id UUID;
    class_1c_id UUID;
    class_1d_id UUID;
    class_1e_id UUID;
BEGIN
    -- Haal level en class IDs op
    SELECT level_id INTO mavo_level_id FROM level WHERE name = 'MAVO';
    SELECT level_id INTO havo_level_id FROM level WHERE name = 'HAVO';
    SELECT level_id INTO vwo_level_id FROM level WHERE name = 'VWO';
    
    SELECT class_id INTO class_1a_id FROM class WHERE class_name = '1A' AND school_year = '2024-2025';
    SELECT class_id INTO class_1b_id FROM class WHERE class_name = '1B' AND school_year = '2024-2025';
    SELECT class_id INTO class_2a_id FROM class WHERE class_name = '2A' AND school_year = '2024-2025';
    SELECT class_id INTO class_1c_id FROM class WHERE class_name = '1C' AND school_year = '2024-2025';
    SELECT class_id INTO class_1d_id FROM class WHERE class_name = '1D' AND school_year = '2024-2025';
    SELECT class_id INTO class_1e_id FROM class WHERE class_name = '1E' AND school_year = '2024-2025';
    
    -- Voeg leerlingen toe met automatisch gegenereerde toegangscodes
    INSERT INTO student (student_number, name, level_id, class_id, parent_access_code) VALUES
		('2024001', 'Emma van der Berg', mavo_level_id, class_1a_id, 'A7X9K2M4P8'),
		('2024002', 'Liam de Vries', mavo_level_id, class_1a_id, 'B3Y6N1Q5R9'),
		('2024003', 'Sophie Jansen', mavo_level_id, class_1a_id, 'C8Z4L7S2W6'),
		('2024004', 'Noah Bakker', mavo_level_id, class_1b_id, 'D5T9H3V8E1'),
		('2024005', 'Olivia Mulder', mavo_level_id, class_1b_id, 'F2K6J4U7G0'),
		('2024006', 'Lucas van Dijk', mavo_level_id, class_1b_id, 'G9M3I8O5X2'),
		('2024007', 'Mila Visser', mavo_level_id, class_2a_id, 'H4P7A6C9Z1'),
		('2024008', 'Finn Koning', mavo_level_id, class_2a_id, 'J8Q2B5Y3K7'),
		
		('2024009', 'Zoë Peters', havo_level_id, class_1c_id, 'K1R9F4N6W8'),
		('2024010', 'Sem van Leeuwen', havo_level_id, class_1c_id, 'L6S3D8T2V5'),
		('2024011', 'Noa de Jong', havo_level_id, class_1d_id, 'M0U7E1X9L4'),
		('2024012', 'Bram Smits', havo_level_id, class_1d_id, 'N5V2G6Y8P3'),
		
		('2024013', 'Ava Hendriks', vwo_level_id, class_1e_id, 'P9W4H7Z1Q6'),
		('2024014', 'Daan van der Meer', vwo_level_id, class_1e_id, 'Q3X8I2A5R0'),
		('2024015', 'Fleur Willems', vwo_level_id, class_1e_id, 'R7Y1J9B4S8'),
		('2024016', 'Jesse van den Heuvel', vwo_level_id, class_1e_id, 'S2Z5K3C6T4')
    ON CONFLICT (student_number) DO NOTHING;
END $$;

-- Voeg voorbeeldbeschikbaarheid toe voor docenten
DO $$
DECLARE
    jan_user_id UUID;
    maria_user_id UUID;
    sandra_user_id UUID;
    anne_user_id UUID;
BEGIN
    -- Haal user IDs op
    SELECT user_id INTO jan_user_id FROM "user" WHERE email = 'j.smit@school.nl';
    SELECT user_id INTO maria_user_id FROM "user" WHERE email = 'm.jansen@school.nl';
    SELECT user_id INTO sandra_user_id FROM "user" WHERE email = 's.de.wit@school.nl';
    SELECT user_id INTO anne_user_id FROM "user" WHERE email = 'a.visser@school.nl';
    
    -- Voeg beschikbaarheid toe voor komende weken
    INSERT INTO availability (user_id, date, start_time, end_time, slot_duration, is_visible, notes) VALUES
        -- Jan Smit beschikbaarheid
        (jan_user_id, '2025-06-02', '09:00', '12:00', 30, true, 'Ochtend spreekuur'),
        (jan_user_id, '2025-06-02', '14:00', '16:00', 20, true, 'Middag spreekuur'),
        (jan_user_id, '2025-06-04', '10:00', '12:00', 30, true, 'Donderdag ochtend'),
        (jan_user_id, '2025-06-05', '13:00', '15:00', 25, true, 'Vrijdag middag'),
        
        -- Maria Jansen beschikbaarheid
        (maria_user_id, '2025-06-03', '08:30', '11:30', 30, true, 'Woensdag ochtend'),
        (maria_user_id, '2025-06-03', '13:30', '16:00', 25, true, 'Woensdag middag'),
        (maria_user_id, '2025-06-05', '09:00', '11:00', 20, true, 'Vrijdag ochtend'),
        
        -- Sandra de Wit beschikbaarheid
        (sandra_user_id, '2025-06-02', '10:00', '12:00', 30, true, 'Maandag ochtend'),
        (sandra_user_id, '2025-06-04', '14:00', '17:00', 30, true, 'Donderdag middag'),
        (sandra_user_id, '2025-06-06', '09:00', '11:00', 25, true, 'Zaterdag ochtend - speciale sessie'),
        
        -- Anne Visser beschikbaarheid
        (anne_user_id, '2025-06-02', '13:00', '16:00', 30, true, 'Maandag middag mentorgesprekken'),
        (anne_user_id, '2025-06-03', '09:00', '12:00', 20, true, 'Woensdag ochtend'),
        (anne_user_id, '2025-06-05', '14:00', '16:30', 25, true, 'Vrijdag middag')
    ON CONFLICT DO NOTHING;
END $$;

-- Voeg een paar voorbeeldafspraken toe
DO $$
DECLARE
    jan_user_id UUID;
    sandra_user_id UUID;
    emma_student_id UUID;
    liam_student_id UUID;
    jan_availability_id UUID;
    sandra_availability_id UUID;
BEGIN
    -- Haal relevante IDs op
    SELECT user_id INTO jan_user_id FROM "user" WHERE email = 'j.smit@school.nl';
    SELECT user_id INTO sandra_user_id FROM "user" WHERE email = 's.de.wit@school.nl';
    SELECT student_id INTO emma_student_id FROM student WHERE student_number = '2024001';
    SELECT student_id INTO liam_student_id FROM student WHERE student_number = '2024002';
    
    -- Haal beschikbaarheid IDs op
    SELECT availability_id INTO jan_availability_id 
    FROM availability 
    WHERE user_id = jan_user_id AND date = '2025-06-02' AND start_time = '09:00' 
    LIMIT 1;
    
    SELECT availability_id INTO sandra_availability_id 
    FROM availability 
    WHERE user_id = sandra_user_id AND date = '2025-06-02' AND start_time = '10:00' 
    LIMIT 1;
    
    -- Voeg voorbeeldafspraken toe
    IF jan_availability_id IS NOT NULL AND emma_student_id IS NOT NULL THEN
        INSERT INTO appointment (
            availability_id, teacher_id, student_id,
            parent_name, parent_email, parent_phone,
            date, start_time, end_time, status
        ) VALUES (
            jan_availability_id, jan_user_id, emma_student_id,
            'Petra van der Berg', 'p.vandenberg@email.nl', '+31612345678',
            '2025-06-02', '09:00', '09:30', 'Scheduled'
        );
    END IF;
    
    IF sandra_availability_id IS NOT NULL AND liam_student_id IS NOT NULL THEN
        INSERT INTO appointment (
            availability_id, teacher_id, student_id,
            parent_name, parent_email, parent_phone,
            date, start_time, end_time, status
        ) VALUES (
            sandra_availability_id, sandra_user_id, liam_student_id,
            'Mark de Vries', 'm.devries@email.nl', '+31612345679',
            '2025-06-02', '10:00', '10:30', 'Scheduled'
        );
    END IF;
END $$;

-- Voeg enkele logboekregels toe
INSERT INTO log (action, entity_type, entity_id, details, ip_address) VALUES
    ('SYSTEM_INIT', 'database', NULL, '{"message": "Database geïnitialiseerd met voorbeelddata", "timestamp": "2025-05-30"}', '127.0.0.1'),
    ('DATA_IMPORT', 'user', NULL, '{"message": "Docenten en beheerders toegevoegd", "count": 10}', '127.0.0.1'),
    ('DATA_IMPORT', 'student', NULL, '{"message": "Voorbeeldleerlingen toegevoegd", "count": 16}', '127.0.0.1'),
    ('DATA_IMPORT', 'class', NULL, '{"message": "Klassen voor schooljaar 2024-2025 toegevoegd", "count": 32}', '127.0.0.1');

-- Toon samenvatting van toegevoegde data
DO $$
DECLARE
    user_count INTEGER;
    student_count INTEGER;
    class_count INTEGER;
    availability_count INTEGER;
    appointment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM "user";
    SELECT COUNT(*) INTO student_count FROM student;
    SELECT COUNT(*) INTO class_count FROM class;
    SELECT COUNT(*) INTO availability_count FROM availability;
    SELECT COUNT(*) INTO appointment_count FROM appointment;
    
    RAISE NOTICE '=== DATABASE POPULATIE VOLTOOID ===';
    RAISE NOTICE 'Gebruikers (docenten/beheerders): %', user_count;
    RAISE NOTICE 'Leerlingen: %', student_count;
    RAISE NOTICE 'Klassen: %', class_count;
    RAISE NOTICE 'Beschikbaarheidsslots: %', availability_count;
    RAISE NOTICE 'Afspraken: %', appointment_count;
    RAISE NOTICE '=====================================';
END $$;

-- Toon enkele voorbeelden van gegenereerde toegangscodes
SELECT 
    s.name as "Leerling Naam",
    s.student_number as "Leerlingnummer", 
    s.parent_access_code as "Ouder Toegangscode",
    c.class_name as "Klas",
    l.name as "Niveau"
FROM student s
JOIN class c ON s.class_id = c.class_id
JOIN level l ON s.level_id = l.level_id
ORDER BY s.student_number
LIMIT 10;