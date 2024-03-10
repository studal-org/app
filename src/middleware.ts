import { NextResponse, type NextRequest } from "next/server";
import { authMiddleware } from "./server/auth/middleware";

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next();
  await authMiddleware(request, response);
  return response;
};
