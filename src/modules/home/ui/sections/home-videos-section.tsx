"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constant";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface Props {
  categoryId?: string;
}

export const HomeVideosSection = ({ categoryId }: Props) => {
  return (
    <Suspense fallback={<HomeVideosSkeleton />} key={categoryId}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <HomeVideosSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const HomeVideosSkeleton = () => (
  <div
    className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
    xl:grid-cols-4 2xl:grid-cols-5 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6"
  >
    {Array.from({ length: 18 }).map((_, index) => (
      <VideoGridCardSkeleton key={index} />
    ))}
  </div>
);
export function HomeVideosSectionSuspense({ categoryId }: Props) {
  const router = useRouter();
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (last) => last.nextCursor }
  );
  return (
    <div>
      <div
        className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-4 2xl:grid-cols-5 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6"
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}
