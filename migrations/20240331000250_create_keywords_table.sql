CREATE TABLE keywords
(
    id         bigserial PRIMARY KEY,
    created_at timestamp(0),
    updated_at timestamp(0),
    word       varchar(255) NOT NULL
        CONSTRAINT keywords_word_unique UNIQUE
);

ALTER TABLE keywords
    OWNER TO website_owner;
