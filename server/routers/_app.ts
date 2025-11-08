import { router } from "../trpc";
import { userRouter } from "./user";
import { userLinksRouter } from "./userLinks";
import { articleRouter } from "./article";
import { articleEngagementRouter } from "./articleEngagement";

export const appRouter = router({
  user: userRouter,
  userLinks: userLinksRouter,
  article: articleRouter,
  articleEngagement: articleEngagementRouter,
});

export type AppRouter = typeof appRouter;
