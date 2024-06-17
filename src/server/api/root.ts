import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { classroomsRouter } from "./routers/classrooms";
import { controlTypesRouter } from "./routers/control-types";
import { disciplinesRouter } from "./routers/disciplines";
import { educationalResourcesRouter } from "./routers/educational-resources";
import { employeesRouter } from "./routers/employees";
import { individualsRouter } from "./routers/individuals";
import { periodSchedulesRouter } from "./routers/period-schedules";
import { practiceKindsRouter } from "./routers/practice-kinds";
import { scheduleForDateRouter } from "./routers/schedule-for-date";
import { userRouter } from "./routers/users";
import { workTypesRouter } from "./routers/work-types";
import { groupsRouter } from "./routers/groups";

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
  scheduleForDate: scheduleForDateRouter,
  periodSchedules: periodSchedulesRouter,
  classrooms: classroomsRouter,
  employees: employeesRouter,
  individuals: individualsRouter,
  educationalResources: educationalResourcesRouter,
  groups: groupsRouter,
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
