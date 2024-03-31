CREATE TABLE notes
(
    id          bigserial PRIMARY KEY,
    created_at  timestamp(0) WITHOUT time zone,
    updated_at  timestamp(0) WITHOUT time zone,
    title       character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);

ALTER TABLE notes
    OWNER TO website_owner;
