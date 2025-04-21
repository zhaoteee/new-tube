"use client";

import { cn } from "@/lib/utils";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { VideoOwner } from "@/modules/videos/ui/components/video-owner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { VideoTopRow } from "@/modules/videos/ui/components/video-top-row";
import { trpc } from "@/trpc/client";
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
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
