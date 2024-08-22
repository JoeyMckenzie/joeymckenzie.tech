CREATE TABLE `keyword_post_tmp` (
	`id` integer PRIMARY KEY NOT NULL,
	`post_id` integer NOT NULL,
	`keyword_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `keywords_tmp` (
	`id` integer PRIMARY KEY NOT NULL,
	`word` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts_tmp` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`published_date` text NOT NULL,
	`heroImage` text NOT NULL,
	`category` text NOT NULL,
	`raw_content` text NOT NULL,
	`parsed_content` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keywords_tmp_word_unique` ON `keywords_tmp` (`word`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_tmp_slug_unique` ON `posts_tmp` (`slug`);