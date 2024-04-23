CREATE TABLE keyword_post (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_id BIGINT NOT NULL,
    keyword_id BIGINT NOT NULL
);

CREATE UNIQUE INDEX keyword_post_post_id_keyword_id_key
    ON keyword_post (post_id, keyword_id);
