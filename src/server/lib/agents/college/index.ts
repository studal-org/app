import { env } from "@/env";
import createClient from "openapi-fetch";
import type { paths } from "./defs";

export const collegeAgent = createClient<paths>({
  baseUrl: env.AGENT_COLLEGE_URL,
  headers: {
    Authorization:
      "Basic " +
      Buffer.from(
        env.AGENT_COLLEGE_USERNAME + ":" + env.AGENT_COLLEGE_PASSWORD,
      ).toString("base64"),
  },
});
