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
    AUTH_SSO_VKID_ID: z.string(),
    AUTH_SSO_VKID_SECRET: z.string(),
    APP_INTERNAL_KEY: z.string(),
    APP_INTERNAL_HOST: z.string().url(),
    APP_PROTOCOL: z.enum(["http", "https"]),
    APP_DOMAIN: z.string(),
    APP_HOST: z.string(),
    APP_URL: z.string().url(),
    APP_TZ: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

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
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_TTL: process.env.SESSION_TTL,
    AUTH_SSO_VKID_ID: process.env.AUTH_SSO_VKID_ID,
    AUTH_SSO_VKID_SECRET: process.env.AUTH_SSO_VKID_SECRET,
    APP_INTERNAL_KEY: process.env.APP_INTERNAL_KEY,
    APP_PROTOCOL: process.env.APP_PROTOCOL,
    APP_DOMAIN: process.env.APP_DOMAIN,
    APP_HOST: process.env.APP_HOST,
    APP_URL: process.env.APP_URL,
    APP_TZ: process.env.APP_TZ,
    APP_INTERNAL_HOST: process.env.APP_INTERNAL_HOST,
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
