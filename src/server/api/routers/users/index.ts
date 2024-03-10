import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { studentRouter } from "./student";

export const userRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
    // const individual = await collegeAgent.GET("/Individual/{id}", {
    //   params: { path: { id: ctx.session.user.id } },
    // });
    // if (!individual.data) {
    //   if (individual.response.status === 404) {
    //     throw new TRPCError({
    //       message: "Could not find User with provided ID.",
    //       code: "NOT_FOUND",
    //     });
    //   }
    //   throw new TRPCError({
    //     message: "Something went wrong.",
    //     code: "INTERNAL_SERVER_ERROR",
    //   });
    // }
    // return individual.data;
  }),
  student: studentRouter,
});
