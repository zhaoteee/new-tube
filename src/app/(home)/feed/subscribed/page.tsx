import { DEFAULT_LIMIT } from "@/constant";
import SubscribedView from "@/modules/home/ui/views/subscribed-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

export default async function page() {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
}
