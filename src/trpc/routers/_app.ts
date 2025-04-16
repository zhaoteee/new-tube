import { studioRouter } from "@/modules/studio/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categoryes/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
