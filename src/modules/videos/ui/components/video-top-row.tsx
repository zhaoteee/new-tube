import { Skeleton } from "@/components/ui/skeleton";
import { VideoGetOneOutput } from "@/modules/videos/types";
import { VideoDescription } from "@/modules/videos/ui/components/video-description";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import { VideoOwner } from "@/modules/videos/ui/components/video-owner";
import { VideoReactions } from "@/modules/videos/ui/components/video-reaction";
import { format, formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

export const VideoTopRow = ({ video }: { video: VideoGetOneOutput }) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", { notation: "compact" }).format(
      video.viewCount
    );
  }, [video.viewCount]);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", { notation: "standard" }).format(
      video.viewCount
    );
  }, [video.viewCount]);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);
  const expandedDate = useMemo(() => {
    return format(video.createdAt, "d MM yyyy");
  }, [video.createdAt]);
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title || "sssssssaaaaa"}</h1>
      <div className="flex justify-between sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />
        <div
          className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end 
            sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2"
        >
          <VideoReactions
            videoId={video.id}
            likes={video.likeCount}
            dislikes={video.disLikeCount}
            viewerReaction={video.viewerReaction}
          />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        expandedDate={expandedDate}
        compactDate={compactDate}
        description={video.description}
      ></VideoDescription>
    </div>
  );
};

export const VideoTopRowSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">
        <Skeleton className="w-full h-6" />
      </h1>
      <div className="flex justify-between sm:flex-row sm:items-start sm:justify-between gap-4">
        <div
          className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end 
            sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2"
        >
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:w-1/5" />
          </div>
        </div>
        <Skeleton className="h-9 w-2/6 md:w-1/6 rounded-full" />
      </div>
      <div className="h-[120px] w-full"></div>
    </div>
  );
};
