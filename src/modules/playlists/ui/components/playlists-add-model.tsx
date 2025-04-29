import { ResponsiveModal } from "@/components/resonsive-modal";
import { trpc } from "@/trpc/client";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constant";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";
interface CreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}
const formSchema = z.object({
  name: z.string().min(1),
});
export const PlaylistsOpenModal = ({
  open,
  onOpenChange,
  videoId,
}: CreateProps) => {
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (last) => last.nextCursor,
      enabled: !!videoId && open,
    }
  );
  const utils = trpc.useUtils();
  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.info("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
      onOpenChange(false);
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong");
    },
  });
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.info("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add to a playlist"
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                disabled={removeVideo.isPending || addVideo.isPending}
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ playlistId: playlist.id, videoId });
                  } else {
                    addVideo.mutate({ playlistId: playlist.id, videoId });
                  }
                }}
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2" />
                ) : (
                  <SquareIcon className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isManual
        />
      </div>
    </ResponsiveModal>
  );
};
