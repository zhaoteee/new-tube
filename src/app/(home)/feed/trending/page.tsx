import { DEFAULT_LIMIT } from "@/constant";
import TrendingView from "@/modules/home/ui/views/trengding-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

export default async function page() {
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
