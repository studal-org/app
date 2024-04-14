import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { studentRouter } from "./student";

export const userRouter = createTRPCRouter({
  read: protectedProcedure.query(({ ctx }) => ctx.session.user),
  student: studentRouter,
});
