CREATE TABLE notes
(
    id          bigserial PRIMARY KEY,
    created_at  timestamp    NOT NULL DEFAULT current_timestamp,
    title       varchar(255) NOT NULL,
    description varchar(255) NOT NULL
);

ALTER TABLE notes
    OWNER TO website_owner;
