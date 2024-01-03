CREATE TABLE `view_counts` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL
);
