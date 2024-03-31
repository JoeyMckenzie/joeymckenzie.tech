CREATE TABLE posts
(
    id             bigserial PRIMARY KEY,
    created_at     timestamp(0),
    updated_at     timestamp(0),
    title          varchar(255)      NOT NULL,
    description    varchar(255)      NOT NULL,
    slug           varchar(255)      NOT NULL
        CONSTRAINT posts_slug_unique UNIQUE,
    published_date date              NOT NULL,
    hero_image     varchar(255)      NOT NULL,
    category       varchar(255)      NOT NULL,
    views          integer DEFAULT 0 NOT NULL,
    raw_content    text              NOT NULL,
    parsed_content text              NOT NULL
);

ALTER TABLE posts OWNER TO website_owner;
