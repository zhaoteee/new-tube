import { DEFAULT_LIMIT } from "@/constant";
import StudioView from "@/modules/studio/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";
export default async function page() {
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
