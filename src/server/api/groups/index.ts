import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { type FetchResponse } from "openapi-fetch";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groupsRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const groups = await collegeAgent.GET("/Groups");
    if (groups.error) {
      throw new TRPCError({
        message: "Something went wrong.",
        code: "INTERNAL_SERVER_ERROR",
        cause: (groups as FetchResponse<unknown>).error,
      });
    }
    return groups.data;
  }),
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const group = await collegeAgent.GET("/Groups/{id}", {
        params: { path: { id: input.id } },
      });
      if (group.error) {
        if (
          group.error.code === "ReferenceNotFound" &&
          group.error.referenceType === "group"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: group.error,
        });
      }
      return group.data;
    }),
});
