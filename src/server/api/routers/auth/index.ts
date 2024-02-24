import { createTRPCRouter } from "../../trpc";
import { emailRouter } from "./email";

export const authRouter = createTRPCRouter({
  email: emailRouter,
});
