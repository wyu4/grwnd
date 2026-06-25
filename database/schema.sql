


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.public_profile (
    id,
    default_name,
    first,
    icon,
    last_updated
  )
  values (
    new.id,

    new.name,

    split_part(new.name, ' ', 1),

    coalesce(
      new.image,
      '/grwnd-light.svg'
    ),

    now()
  );

  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."account" (
    "id" "text" NOT NULL,
    "accountId" "text" NOT NULL,
    "providerId" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "accessToken" "text",
    "refreshToken" "text",
    "idToken" "text",
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    "scope" "text",
    "password" "text",
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."account" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."apikey" (
    "id" "text" NOT NULL,
    "configId" "text" NOT NULL,
    "name" "text",
    "start" "text",
    "referenceId" "text" NOT NULL,
    "prefix" "text",
    "key" "text" NOT NULL,
    "refillInterval" integer,
    "refillAmount" integer,
    "lastRefillAt" timestamp with time zone,
    "enabled" boolean,
    "rateLimitEnabled" boolean,
    "rateLimitTimeWindow" integer,
    "rateLimitMax" integer,
    "requestCount" integer,
    "remaining" integer,
    "lastRequest" timestamp with time zone,
    "expiresAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "permissions" "text",
    "metadata" "text"
);


ALTER TABLE "public"."apikey" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author" "text",
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" NOT NULL,
    "demo" "text",
    "repo" "text",
    "last_edited" timestamp with time zone
);


ALTER TABLE "public"."post" OWNER TO "postgres";


COMMENT ON TABLE "public"."post" IS 'Storing all posts';



CREATE TABLE IF NOT EXISTS "public"."public_profile" (
    "id" "text" NOT NULL,
    "first" "text" NOT NULL,
    "last" "text",
    "description" "text" DEFAULT 'No description'::"text",
    "role" "text",
    "icon" "text" DEFAULT '/grwnd-light.svg'::"text" NOT NULL,
    "github_user" "text",
    "default_name" "text" DEFAULT 'unnamed'::"text" NOT NULL,
    "last_updated" timestamp with time zone,
    "last_post" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."public_profile" OWNER TO "postgres";


COMMENT ON TABLE "public"."public_profile" IS 'Public displayed profiles for users';



COMMENT ON COLUMN "public"."public_profile"."default_name" IS 'Grwnd username';



CREATE TABLE IF NOT EXISTS "public"."session" (
    "id" "text" NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "token" "text" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" "text",
    "userAgent" "text",
    "userId" "text" NOT NULL
);


ALTER TABLE "public"."session" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "emailVerified" boolean NOT NULL,
    "image" "text",
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."user" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."verification" (
    "id" "text" NOT NULL,
    "identifier" "text" NOT NULL,
    "value" "text" NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."verification" OWNER TO "postgres";


ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."apikey"
    ADD CONSTRAINT "apikey_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."public_profile"
    ADD CONSTRAINT "public_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."verification"
    ADD CONSTRAINT "verification_pkey" PRIMARY KEY ("id");



CREATE INDEX "account_userId_idx" ON "public"."account" USING "btree" ("userId");



CREATE INDEX "apikey_configId_idx" ON "public"."apikey" USING "btree" ("configId");



CREATE INDEX "apikey_key_idx" ON "public"."apikey" USING "btree" ("key");



CREATE INDEX "apikey_referenceId_idx" ON "public"."apikey" USING "btree" ("referenceId");



CREATE INDEX "session_userId_idx" ON "public"."session" USING "btree" ("userId");



CREATE INDEX "verification_identifier_idx" ON "public"."verification" USING "btree" ("identifier");



CREATE OR REPLACE TRIGGER "on_user_created" AFTER INSERT ON "public"."user" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "post_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."public_profile"
    ADD CONSTRAINT "public_profile_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE;



CREATE POLICY "read_all" ON "public"."post" FOR SELECT USING (true);



CREATE POLICY "read_all" ON "public"."public_profile" FOR SELECT USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."account" TO "anon";
GRANT ALL ON TABLE "public"."account" TO "authenticated";
GRANT ALL ON TABLE "public"."account" TO "service_role";



GRANT ALL ON TABLE "public"."apikey" TO "anon";
GRANT ALL ON TABLE "public"."apikey" TO "authenticated";
GRANT ALL ON TABLE "public"."apikey" TO "service_role";



GRANT ALL ON TABLE "public"."post" TO "anon";
GRANT ALL ON TABLE "public"."post" TO "authenticated";
GRANT ALL ON TABLE "public"."post" TO "service_role";



GRANT ALL ON TABLE "public"."public_profile" TO "anon";
GRANT ALL ON TABLE "public"."public_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."public_profile" TO "service_role";



GRANT ALL ON TABLE "public"."session" TO "anon";
GRANT ALL ON TABLE "public"."session" TO "authenticated";
GRANT ALL ON TABLE "public"."session" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



GRANT ALL ON TABLE "public"."verification" TO "anon";
GRANT ALL ON TABLE "public"."verification" TO "authenticated";
GRANT ALL ON TABLE "public"."verification" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







