import { env } from "@/env";
import { cache } from "react";
import "server-only";
import { db } from "../db";
import { authenticate } from "./authenticate";
import { deauthenticate } from "./deauthenticate";
import { sessionTokenController } from "./tokens";

const findSession = (jti: string) =>
  db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.jti, jti),
    with: { user: true },
  });

export const getSession = cache(async () => {
  const { payload } = await sessionTokenController.get();
  if (!payload) return null;

  const session = await findSession(payload.jti);
  if (!session) return null;

  return session;
});

export const sessionHandler = cache(
  async (): Promise<
    | { fresh: false }
    | {
        fresh: true;
        sessionInfo:
          | undefined
          | Awaited<ReturnType<typeof authenticate>>["newSession"];
      }
  > => {
    const sessionInfo = await sessionTokenController.get();
    if (!sessionInfo.token) return { fresh: false };

    const session = await findSession(sessionInfo.payload.jti);
    if (!session) {
      sessionTokenController.destroy();
      return { fresh: true, sessionInfo: undefined };
    }

    const halfExp = new Date(
      session.exp.getTime() - (env.SESSION_TTL * 1000) / 2,
    );
    if (halfExp < new Date()) {
      await deauthenticate();
      const { newSession: newSessionInfo } = await authenticate(session.sub);
      return { fresh: true, sessionInfo: newSessionInfo };
    }

    return { fresh: false };
  },
);
