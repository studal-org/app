CREATE TABLE IF NOT EXISTS "studal_auth_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studal_sessions" (
	"jti" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub" uuid NOT NULL,
	"iat" timestamp NOT NULL,
	"nbf" timestamp NOT NULL,
	"exp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studal_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar,
	"email" varchar NOT NULL,
	CONSTRAINT "studal_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "studal_auth_links" ADD CONSTRAINT "studal_auth_links_user_id_studal_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studal_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "studal_sessions" ADD CONSTRAINT "studal_sessions_sub_studal_users_id_fk" FOREIGN KEY ("sub") REFERENCES "public"."studal_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
