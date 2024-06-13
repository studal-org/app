import { createTRPCRouter } from "@/server/api/trpc";
import { administratorProcedure } from "./procedure";

export const adminRouter = createTRPCRouter({
  read: administratorProcedure.query(async ({ ctx }) => {
    return ctx.session.administrator;
  }),
});
