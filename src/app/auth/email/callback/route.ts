import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const authLinkId = req.nextUrl.searchParams.get("authLinkId");
  if (!authLinkId) {
    redirect("/auth");
  }
  try {
    await api.auth.email.callback.mutate({ authLinkId });
  } catch (error) {
    if (error instanceof TRPCClientError && error.cause instanceof TRPCError)
      return new NextResponse(error.message, {
        status: getHTTPStatusCodeFromError(error.cause),
      });
  }
  redirect("/dashboard");
};
