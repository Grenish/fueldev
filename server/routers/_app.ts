import { router } from "../trpc";
import { userRouter } from "./user";
import { userLinksRouter } from "./userLinks";
import { articleRouter } from "./article";
import { articleEngagementRouter } from "./articleEngagement";
import { storeRouter } from "./store";

export const appRouter = router({
  user: userRouter,
  userLinks: userLinksRouter,
  article: articleRouter,
  articleEngagement: articleEngagementRouter,
  store: storeRouter,
});

export type AppRouter = typeof appRouter;
