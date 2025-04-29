"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constant";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

export const VideosViewSection = ({ playlistId }: { playlistId: string }) => {
  return (
    <Suspense fallback={<VideosViewSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosViewSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const VideosViewSkeleton = () => (
  <>
    <div className="flex flex-col gap-4 md:hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
    <div className="hidden flex-col gap-4 md:flex">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoRowCardSkeleton key={index} />
      ))}
    </div>
  </>
);
export function VideosViewSectionSuspense({
  playlistId,
}: {
  playlistId: string;
}) {
  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    {
      playlistId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (last) => last.nextCursor }
  );
  const utils = trpc.useUtils();
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.info("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ videoId: video.id, playlistId })
              }
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              onRemove={() => {
                console.log(video.id);
                removeVideo.mutate({ videoId: video.id, playlistId });
              }}
              size="compact"
            />
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
