import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { controlTypesRouter } from "./routers/control-types";
import { disciplinesRouter } from "./routers/disciplines";
import { practiceKindsRouter } from "./routers/practice-kinds";
import { userRouter } from "./routers/users";
import { workTypesRouter } from "./routers/work-types";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  disciplines: disciplinesRouter,
  controlTypes: controlTypesRouter,
  workTypes: workTypesRouter,
  practiceKinds: practiceKindsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
