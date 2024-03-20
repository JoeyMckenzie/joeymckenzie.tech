-- The database initialization script is used for defining your local schema as well as postgres
-- running within a docker container, where we'll copy this file over and run on startup

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'hop_tracker') THEN
            CREATE DATABASE hop_tracker;
        END IF;
    END
$$;

\c hop_tracker;

DROP TABLE IF EXISTS breweries CASCADE;
CREATE TABLE breweries
(
    id           SERIAL PRIMARY KEY,
    brewery_name VARCHAR(255) NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS beers CASCADE;
DROP TYPE IF EXISTS beer_type;

CREATE TYPE beer_type AS ENUM ('ipa', 'double_ipa');
CREATE TABLE beers
(
    id         SERIAL PRIMARY KEY,
    brewery_id INTEGER      NOT NULL,
    beer_name  VARCHAR(255) NOT NULL,
    beer_type  beer_type    NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_brewery_id FOREIGN KEY (brewery_id) REFERENCES breweries (id)
);

DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees
(
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    brewery_id INTEGER      NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_brewery_id FOREIGN KEY (brewery_id) REFERENCES breweries (id)
);

-- Seed a brewery into the database that we can attach employees and beers to
INSERT INTO breweries (brewery_name)
VALUES ('Fall River Brewery');

-- Next, seed some beer tasty beers
INSERT INTO beers (brewery_id, beer_name, beer_type)
VALUES ((SELECT id
         FROM breweries
         WHERE brewery_name = 'Fall River Brewery'), 'Hexagenia', 'ipa'),
       ((SELECT id
         FROM breweries
         WHERE brewery_name = 'Fall River Brewery'), 'Widowmaker', 'double_ipa');

-- Then, seed some loyal employees
INSERT INTO employees (first_name, last_name, brewery_id)
VALUES ('Sam', 'Adams', (SELECT id
                         FROM breweries
                         WHERE brewery_name = 'Fall River Brewery'));
