import MagicLinkEmail, { magicLinkEmailSubject } from "@/emails/magic-link";
import { env } from "@/env";
import { authenticate } from "@/server/auth/authenticate";
import { db } from "@/server/db";
import { authLinks, users } from "@/server/db/schema";
import { collegeAgent } from "@/server/lib/agents/college";
import { render } from "@react-email/components";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { transport } from "../../../email";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const emailRouter = createTRPCRouter({
  initiate: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const individual = await collegeAgent.GET("/Individual/FindByEmail", {
        params: { query: { email: input.email } },
      });

      if (individual.error) {
        if (individual.error.code === "NotFound")
          throw new TRPCError({
            message: "Individual with this email was not found.",
            code: "NOT_FOUND",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: individual.error,
        });
      }

      const { id: userId, name: _, ...updateData } = individual.data;
      await db
        .insert(users)
        .values(individual.data)
        .onConflictDoUpdate({ target: users.id, set: updateData });

      const authLinkInsertResult = await db
        .insert(authLinks)
        .values({ userId, validUntil: new Date(Date.now() + 1000 * 60 * 30) })
        .returning({ authLinkId: authLinks.id });
      const { authLinkId } = authLinkInsertResult[0]!;

      await transport.sendMail({
        from: env.SMTP_FROM,
        to: input.email,
        subject: magicLinkEmailSubject,
        html: render(
          MagicLinkEmail({
            name: individual.data.fullName ?? individual.data.email,
            magicLink:
              `${env.NEXT_PUBLIC_APP_URL}/auth/email/callback?` +
              new URLSearchParams({ authLinkId }).toString(),
          }),
        ),
      });
    }),
  callback: publicProcedure
    .input(z.object({ authLinkId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const authLink = await db.query.authLinks.findFirst({
        where: eq(authLinks.id, input.authLinkId),
        columns: { isUsed: true, userId: true, validUntil: true },
      });

      if (!authLink)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Could not find this link",
        });
      if (authLink.isUsed)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This link was already used",
        });
      if (new Date() > authLink.validUntil)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This link expired",
        });
      await db
        .update(authLinks)
        .set({ isUsed: true })
        .where(eq(authLinks.id, input.authLinkId));

      await authenticate(authLink.userId);
    }),
});
