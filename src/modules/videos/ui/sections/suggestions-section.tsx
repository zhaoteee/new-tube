"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LIMIT } from "@/constant";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const SuggestionsSection = ({
  videoId,
  isManual,
}: {
  videoId: string;
  isManual?: boolean;
}) => {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};
const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-20" />
        ))}
      </div>
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-20" />
        ))}
      </div>
    </>
  );
};
export const SuggestionsSectionSuspense = ({
  videoId,
  isManual,
}: {
  videoId: string;
  isManual?: boolean;
}) => {
  const [data, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastpage) => lastpage.nextCursor }
  );
  return (
    <>
      <div className="hidden md:block space-y-3">
        {data?.pages
          .flatMap((page) => page.items)
          .map((item) => (
            <VideoRowCard data={item} key={item.id} size="compact" />
          ))}
      </div>
      <div className="block md:hidden space-y-10">
        {data?.pages
          .flatMap((page) => page.items)
          .map((item) => (
            <VideoGridCard data={item} key={item.id} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      ></InfiniteScroll>
    </>
  );
};
