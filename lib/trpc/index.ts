// Export client-side utilities
export { trpc } from "./client";

// Export React hooks and provider
export { trpc as trpcReact, TRPCProvider } from "./react";

// Export server-side utilities
export { createServerCaller } from "./server";

// Export types
export type { AppRouter } from "@/server/routers/_app";
