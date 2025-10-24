import "server-only";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/context";
import { cache } from "react";
import { headers } from "next/headers";

export const createServerCaller = cache(async () => {
  const headersStore = await headers();

  const context = await createTRPCContext({
    req: new Request("http://localhost", {
      headers: headersStore,
    }),
    resHeaders: new Headers(),
    info: {
      isBatchCall: false,
      calls: [],
      accept: "application/jsonl",
      type: "query" as const,
      connectionParams: null,
      signal: new AbortController().signal,
      url: new URL("http://localhost"),
    },
  });

  return appRouter.createCaller(context);
});
