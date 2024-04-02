CREATE TABLE keyword_post
(
    id         bigserial PRIMARY KEY,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    post_id    bigint    NOT NULL,
    keyword_id bigint    NOT NULL,
    UNIQUE (post_id, keyword_id)
);


ALTER TABLE keyword_post
    OWNER TO website_owner;
