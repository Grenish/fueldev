import { router } from "../trpc";
import { userRouter } from "./user";
import { userLinksRouter } from "./userLinks";
import { articleRouter } from "./article";

export const appRouter = router({
  user: userRouter,
  userLinks: userLinksRouter,
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
