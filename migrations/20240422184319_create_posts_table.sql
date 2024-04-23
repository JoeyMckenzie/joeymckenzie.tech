CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    published_date DATE NOT NULL,
    hero_image VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    raw_content TEXT NOT NULL,
    parsed_content TEXT NOT NULL
);

-- Add a trigger to automatically update 'updated_at' on record update
CREATE OR REPLACE FUNCTION update_modified_column ()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column ();

