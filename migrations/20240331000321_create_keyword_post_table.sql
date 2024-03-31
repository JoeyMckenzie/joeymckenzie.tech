CREATE TABLE keyword_post
(
    id         bigserial PRIMARY KEY,
    post_id    bigint NOT NULL,
    keyword_id bigint NOT NULL
);

ALTER TABLE keyword_post
    OWNER TO website_owner;
