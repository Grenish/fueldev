// Export client-side utilities
export { trpc } from "./client";

// Export React hooks and provider
export { trpc as trpcReact, TRPCProvider } from "./react";

// NOTE: Server-side utilities are not exported here to avoid client-side imports
// Import directly from "./server" in server components only

// Export types (types are safe to export)
export type { AppRouter } from "@/server/routers/_app";
