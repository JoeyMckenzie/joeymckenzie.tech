-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "_sqlx_migrations" (
	"version" bigint PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"installed_on" timestamp with time zone DEFAULT now() NOT NULL,
	"success" boolean NOT NULL,
	"checksum" "bytea" NOT NULL,
	"execution_time" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "view_counts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL
);

*/