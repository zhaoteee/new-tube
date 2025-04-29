import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistGetManyOutput } from "@/modules/playlists/type";
import { PlaylistThumbnail } from "@/modules/playlists/ui/components/playlist-grid-card/playlist-thumbnail";
import Link from "next/link";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl || "/placeholder.svg"}
          title={data.name}
          videoCount={data.videoCount}
        />
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words">
              {data.name}
            </h3>
            <p className="text-sm text-muted-foreground">Playlist</p>
            <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
              View full playlist
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Skeleton className="size-full" />
      </div>
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-[90%]" />
          <Skeleton className="h-5 w-[70%]" />
          <Skeleton className="h-5 w-[50%]" />
        </div>
      </div>
    </div>
  );
};
