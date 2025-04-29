"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constant";
import {
  PlaylistGridCard,
  PlaylistGridCardSkeleton,
} from "@/modules/playlists/ui/components/playlist-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const PlaylistsVideosSection = () => {
  return (
    <Suspense fallback={<PlaylistsVideosSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PlaylistsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const PlaylistsVideosSkeleton = () => (
  <>
    <div
      className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-4 2xl:grid-cols-5 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <PlaylistGridCardSkeleton key={index} />
      ))}
    </div>
  </>
);
export function PlaylistsSectionSuspense() {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (last) => last.nextCursor }
  );
  return (
    <>
      <div
        className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-4 2xl:grid-cols-5 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6"
      >
        {playlists.pages
          .flatMap((list) => list.items)
          .map((playlist) => (
            <PlaylistGridCard key={playlist.id} data={playlist} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
}
