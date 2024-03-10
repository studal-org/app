import { api } from "@/trpc/internal";
import type { NextRequest, NextResponse } from "next/server";
import { sessionTokenController } from "./tokens";

const skipUrls = ["/_next", "/favicon.ico"];

export const authMiddleware = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const skipUrlsMatches = skipUrls.map((url) =>
    request.nextUrl.pathname.startsWith(url),
  );
  if (skipUrlsMatches.some((v) => v === true)) return;

  const session = await api.auth.session.mutate();
  if (!session.fresh) return;

  const { sessionInfo } = session;

  if (!sessionInfo) {
    response.cookies.delete(sessionTokenController.tokenName);
    return;
  }

  response.cookies.set(
    sessionTokenController.tokenName,
    sessionInfo.token,
    sessionTokenController.generateCookieOptions(
      // TODO: Investigate. For some reason, response data does not get parsed with superjson.
      new Date(sessionInfo.payload.exp),
    ),
  );
};
