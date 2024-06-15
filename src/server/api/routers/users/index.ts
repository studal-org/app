import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { adminRouter } from "./admins";
import { ssoRouter } from "./sso";
import { studentRouter } from "./student";

export const userRouter = createTRPCRouter({
  readSelf: protectedProcedure.query(({ ctx }) => ctx.session.user),
  student: studentRouter,
  admin: adminRouter,
  sso: ssoRouter,
});
