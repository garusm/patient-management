-- Ensure the 'patient' table exists
CREATE TABLE IF NOT EXISTS patient
(
    id                UUID PRIMARY KEY,
    name              VARCHAR(255)        NOT NULL,
    email             VARCHAR(255) UNIQUE NOT NULL,
    address           VARCHAR(255)        NOT NULL,
    date_of_birth     DATE                NOT NULL,
    registration_date DATE                NOT NULL
    );

-- Insert well-known UUIDs for specific patients
INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '123e4567-e89b-12d3-a456-426614174000',
       'Jan Kowalski',
       'jan.kowalski@example.pl',
       'ul. Główna 123, 00-001 Warszawa',
       '1985-06-15',
       '2024-01-10'
    WHERE NOT EXISTS (SELECT 1
                  FROM patient
                  WHERE id = '123e4567-e89b-12d3-a456-426614174000');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '123e4567-e89b-12d3-a456-426614174001',
       'Anna Nowak',
       'anna.nowak@example.pl',
       'ul. Lipowa 456, 30-001 Kraków',
       '1990-09-23',
       '2023-12-01'
    WHERE NOT EXISTS (SELECT 1
                  FROM patient
                  WHERE id = '123e4567-e89b-12d3-a456-426614174001');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '123e4567-e89b-12d3-a456-426614174002',
       'Alicja Wiśniewska',
       'alicja.wisniewska@example.pl',
       'ul. Dębowa 789, 80-001 Gdańsk',
       '1978-03-12',
       '2022-06-20'
    WHERE NOT EXISTS (SELECT 1
                  FROM patient
                  WHERE id = '123e4567-e89b-12d3-a456-426614174002');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '123e4567-e89b-12d3-a456-426614174003',
       'Piotr Zieliński',
       'piotr.zielinski@example.pl',
       'ul. Sosnowa 321, 90-001 Łódź',
       '1982-11-30',
       '2023-05-14'
    WHERE NOT EXISTS (SELECT 1
                  FROM patient
                  WHERE id = '123e4567-e89b-12d3-a456-426614174003');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '123e4567-e89b-12d3-a456-426614174004',
       'Emilia Dąbrowska',
       'emilia.dabrowska@example.pl',
       'ul. Klonowa 654, 20-001 Lublin',
       '1995-02-05',
       '2024-03-01'
    WHERE NOT EXISTS (SELECT 1
                  FROM patient
                  WHERE id = '123e4567-e89b-12d3-a456-426614174004');

-- Insert well-known UUIDs for specific patients
INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174005',
       'Michał Wójcik',
       'michal.wojcik@example.pl',
       'ul. Cedrowa 987, 40-001 Katowice',
       '1988-07-25',
       '2024-02-15'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174005');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174006',
       'Sara Kowalczyk',
       'sara.kowalczyk@example.pl',
       'ul. Brzozowa 123, 50-001 Wrocław',
       '1992-04-18',
       '2023-08-25'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174006');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174007',
       'Dawid Kamiński',
       'dawid.kaminski@example.pl',
       'ul. Jesionowa 456, 61-001 Poznań',
       '1975-01-11',
       '2022-10-10'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174007');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174008',
       'Laura Lewandowska',
       'laura.lewandowska@example.pl',
       'ul. Palmowa 789, 70-001 Szczecin',
       '1989-09-02',
       '2024-04-20'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174008');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174009',
       'Jakub Nowicki',
       'jakub.nowicki@example.pl',
       'ul. Wiśniowa 321, 15-001 Białystok',
       '1993-11-15',
       '2023-06-30'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174009');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174010',
       'Ewa Mazur',
       'ewa.mazur@example.pl',
       'ul. Świerkowa 654, 35-001 Rzeszów',
       '1980-08-09',
       '2023-01-22'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174010');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174011',
       'Eryk Krawczyk',
       'eryk.krawczyk@example.pl',
       'ul. Sekwojowa 987, 44-100 Gliwice',
       '1984-05-03',
       '2024-05-12'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174011');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174012',
       'Zofia Kaczmarek',
       'zofia.kaczmarek@example.pl',
       'ul. Orzechowa 123, 10-001 Olsztyn',
       '1991-12-25',
       '2022-11-11'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174012');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174013',
       'Daniel Piotrowski',
       'daniel.piotrowski@example.pl',
       'ul. Cyprysowa 456, 87-100 Toruń',
       '1976-06-08',
       '2023-09-19'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174013');

INSERT INTO patient (id, name, email, address, date_of_birth, registration_date)
SELECT '223e4567-e89b-12d3-a456-426614174014',
       'Izabela Grabowska',
       'izabela.grabowska@example.pl',
       'ul. Wierzbową 789, 81-001 Gdynia',
       '1987-10-17',
       '2024-03-29'
    WHERE NOT EXISTS (SELECT 1 FROM patient WHERE id = '223e4567-e89b-12d3-a456-426614174014');