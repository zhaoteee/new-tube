import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

export const VideoThumbnail = ({
  imgUrl,
  previewUrl,
  duration,
  title,
}: {
  imgUrl: string;
  title: string;
  previewUrl: string | null;
  duration: number | null;
}) => {
  return (
    <div className="relative group">
      <div className="reletive w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imgUrl ? imgUrl : "/placeholder.svg"}
          alt={title}
          fill
          loader={({ src }) => `${src}?width=120`}
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl || imgUrl || "/placeholder.svg"}
          alt={title}
          fill
          loader={({ src }) => `${src}?width=220`}
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration || 0)}
      </div>
    </div>
  );
};

export const VideoThumbnailSkeleton = () => (
  <div className="relative group">
    <div className="reletive w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full object-cover group-hover:opacity-0" />
    </div>
    <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
      <Skeleton className="w-10 h-6" />
    </div>
  </div>
);
