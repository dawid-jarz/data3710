CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE brukere (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('KUNDE', 'ADMIN'))
);

CREATE TABLE åpnings_tider (
    id SERIAL PRIMARY KEY,
    ukedag INT NOT NULL CHECK (ukedag BETWEEN 1 AND 7), -- 1 = MANDAG, 7 = SØNDAG --
    åpen_tid TIME NOT NULL,
    steng_tid TIME NOT NULL
    CHECK (åpen_tid < steng_tid)
);