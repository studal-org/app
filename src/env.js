import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AGENT_COLLEGE_URL: z.string().url(),
    AGENT_COLLEGE_USERNAME: z.string(),
    AGENT_COLLEGE_PASSWORD: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_FROM: z.string().email(),
    SESSION_SECRET: z.string().transform((v) => new TextEncoder().encode(v)),
    SESSION_TTL: z.coerce.number(),
    APP_INTERNAL_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AGENT_COLLEGE_URL: process.env.AGENT_COLLEGE_URL,
    AGENT_COLLEGE_USERNAME: process.env.AGENT_COLLEGE_USERNAME,
    AGENT_COLLEGE_PASSWORD: process.env.AGENT_COLLEGE_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_TTL: process.env.SESSION_TTL,
    APP_INTERNAL_KEY: process.env.APP_INTERNAL_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
