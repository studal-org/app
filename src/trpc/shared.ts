import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";
import { TRPCClientError, type LoggerLinkOptions } from "@trpc/client";

export const transformer = superjson;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcPath = "/api/trpc";

export function getUrl() {
  return getBaseUrl() + trpcPath;
}

export const loggerLinkEnabled: NonNullable<
  LoggerLinkOptions<AppRouter>["enabled"]
> = (op) => {
  return (
    process.env.NODE_ENV === "development" ||
    (op.direction === "down" && op.result instanceof Error)
  );
};

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const isTRPCClientError = (
  cause: unknown,
): cause is TRPCClientError<AppRouter> => cause instanceof TRPCClientError;
