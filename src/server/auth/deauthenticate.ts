import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions } from "../db/schema";
import { sessionTokenController } from "./tokens";

export const deauthenticate = async () => {
  const oldSession = await sessionTokenController.get();
  if (!oldSession.payload) return { oldSession: undefined };

  sessionTokenController.destroy();

  await db.delete(sessions).where(eq(sessions.jti, oldSession.payload.jti));

  return { oldSession };
};
