import { DEFAULT_LIMIT } from "@/constant";
import HomeView from "@/modules/home/ui/views/home-view";
import TrendingView from "@/modules/home/ui/views/trengding-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function page({ searchParams }: PageProps) {
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
