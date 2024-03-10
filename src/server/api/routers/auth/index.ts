import { sessionHandler } from "@/server/auth/session";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  internalProcedure,
  protectedProcedure,
} from "../../trpc";
import { emailRouter } from "./email";

export const authRouter = createTRPCRouter({
  email: emailRouter,
  session: internalProcedure.mutation(sessionHandler),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(sessions).where(eq(sessions.jti, ctx.session.jti));
  }),
});
