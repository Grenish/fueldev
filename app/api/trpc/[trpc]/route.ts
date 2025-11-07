import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    // Enable batching for better performance
    batching: {
      enabled: true,
    },
    // Add response metadata for caching
    responseMeta(opts) {
      const { errors, type } = opts;

      // Check if all procedures are queries (not mutations)
      const isQuery = type === "query";
      // Check that no procedures errored
      const allOk = errors.length === 0;

      // Apply caching for successful queries
      if (allOk && isQuery) {
        // Cache for 10 seconds, revalidate in background for 1 hour
        return {
          headers: {
            "cache-control": "s-maxage=10, stale-while-revalidate=3600",
          },
        };
      }

      return {};
    },
    // Error handling
    onError(opts) {
      const { error, type, path } = opts;

      if (process.env.NODE_ENV === "development") {
        console.error(`❌ tRPC Error on ${type} ${path}:`, error);
      } else {
        // In production, only log server errors
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error(`❌ tRPC Internal Error on ${type} ${path}:`, {
            message: error.message,
            code: error.code,
          });
        }
      }
    },
  });

export { handler as GET, handler as POST };
