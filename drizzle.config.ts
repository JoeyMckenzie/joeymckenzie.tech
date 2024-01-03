import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
	schema: "./src/lib/schema.ts",
	out: "./drizzle",
	driver: "turso",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
		authToken: process.env.TURSO_AUTH_TOKEN ?? "",
	},
	verbose: true,
	strict: true,
};

export default config;
