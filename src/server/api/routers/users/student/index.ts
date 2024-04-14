import { createTRPCRouter } from "@/server/api/trpc";
import { performanceRouter } from "./performance";
import { studentProcedure } from "./procedure";

export const studentRouter = createTRPCRouter({
  read: studentProcedure.query(async ({ ctx }) => {
    return ctx.session.student;
  }),
  performance: performanceRouter,
});
