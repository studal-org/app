import "server-only";

import { env } from "@/env";
import { type AppRouter } from "@/server/api/root";
import { createTRPCClient, httpLink, loggerLink } from "@trpc/client";
import { headers } from "next/headers";
import { getUrl, loggerLinkEnabled, transformer } from "./shared";

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) => loggerLinkEnabled(op),
    }),
    httpLink({
      transformer,
      url: getUrl(),
      async headers() {
        const headersStore = headers();
        const result = new Headers();
        result.set("x-internal-key", env.APP_INTERNAL_KEY);
        result.set("cookie", headersStore.get("cookie") ?? "");
        return Object.fromEntries(result);
      },
    }),
  ],
});
