CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL
);
