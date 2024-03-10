import { env } from "@/env";
import { db } from "../db";
import { sessions } from "../db/schema";
import { sessionTokenController } from "./tokens";

export const authenticate = async (userId: string) => {
  const now = new Date();
  const tokenValues = {
    sub: userId,
    iat: now,
    nbf: now,
    exp: new Date(now.getTime() + env.SESSION_TTL * 1000),
  };

  const sessionInsertResult = await db
    .insert(sessions)
    .values(tokenValues)
    .returning({ jti: sessions.jti });
  const { jti } = sessionInsertResult[0]!;

  const newSession = await sessionTokenController.set({
    ...tokenValues,
    jti,
  });

  return { newSession };
};
