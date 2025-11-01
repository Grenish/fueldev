import { router } from "../trpc";
import { userRouter } from "./user";
import { userLinksRouter } from "./userLinks";

export const appRouter = router({
  user: userRouter,
  userLinks: userLinksRouter,
});

export type AppRouter = typeof appRouter;
