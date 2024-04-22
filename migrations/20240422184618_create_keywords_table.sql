CREATE TABLE keywords_tmp (
    id serial PRIMARY KEY,
    created_at timestamp WITHOUT time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    word varchar(255) NOT NULL UNIQUE
);

