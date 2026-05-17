import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

/**
 * Context object passed to all tRPC procedures.
 * Contains HTTP request/response and authenticated user (if available).
 */
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  /** Authenticated user or null if not authenticated */
  user: User | null;
};

/**
 * Create tRPC context for a request.
 *
 * Attempts to authenticate the request using the SDK.
 * Authentication is optional - public procedures work with null user.
 *
 * @param opts - Express context options
 * @returns TrPC context with optional authenticated user
 */
export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
