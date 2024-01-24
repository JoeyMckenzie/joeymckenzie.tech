CREATE TABLE `notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `view_counts` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL
);
