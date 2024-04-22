CREATE TABLE posts_tmp (
    id serial PRIMARY KEY,
    created_at timestamp WITHOUT time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp WITHOUT time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    published_date date NOT NULL,
    hero_image varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
    views integer NOT NULL DEFAULT 0,
    raw_content text NOT NULL,
    parsed_content text NOT NULL
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

CREATE TRIGGER update_posts_tmp_modtime
    BEFORE UPDATE ON posts_tmp
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column ();

