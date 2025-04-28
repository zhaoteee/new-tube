import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoGetManyOutput } from "@/modules/videos/types";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import {
  VideoThumbnail,
  VideoThumbnailSkeleton,
} from "@/modules/videos/ui/components/video-thumbnail";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

interface VideoGridCardPorps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCard = ({ data, onRemove }: VideoGridCardPorps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", { notation: "compact" }).format(
      data.viewCount
    );
  }, [data.viewCount]);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt);
  }, [data.createdAt]);
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          imgUrl={data.thumbnailUrl!}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <div className="flex gap-3">
        <Link href={`/users/${data.user.id}`}>
          <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/videos/${data.id}`}>
            <h3 className="font-medium line-clamp-1 text-base break-words">
              {data.title}
            </h3>
          </Link>
          <Link href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} />
          </Link>
          <Link
            href={`/videos/${data.id}`}
            className="text-xs text-muted-foreground"
          >
            {compactViews} views * {compactDate}
          </Link>
        </div>
        <div className="shrink-0">
          <VideoMenu videoId={data.id} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
};
export const VideoGridCardSkeleton = () => (
  <div className="flex flex-col gap-2 w-full group">
    <VideoThumbnailSkeleton />
    <div className="flex gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="min-w-0 flex-1">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-10 h-6" />
      </div>
    </div>
  </div>
);
