import { DEFAULT_LIMIT } from "@/constant";
import PlaylistsView from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

export default async function Page() {
  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}
