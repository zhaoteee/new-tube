"use client";

import { cn } from "@/lib/utils";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { VideoTopRow } from "@/modules/videos/ui/components/video-top-row";
import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideoSection = ({ videoId }: { videoId: string }) => {
  return (
    <Suspense fallback={<p>Loadng....</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId}></VideoSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideoSectionSuspense = ({ videoId }: { videoId: string }) => {
  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();
  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const handlePlay = () => {
    if (!isSignedIn) return;
    createView.mutate({ videoId });
  };
  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
