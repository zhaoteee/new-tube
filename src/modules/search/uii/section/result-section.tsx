"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constant";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>} key={`${query}-${categoryId}`}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ResultsSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ResultsSectionSuspense = ({
  query,
  categoryId,
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, querys] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      limit: DEFAULT_LIMIT,
      categoryId,
    },
    { getNextPageParam: (last) => last.nextCursor }
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={querys.hasNextPage}
        isFetchingNextPage={querys.isFetchingNextPage}
        fetchNextPage={querys.fetchNextPage}
      />
    </>
  );
};
