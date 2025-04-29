import { PlaylistHeaderSection } from "@/modules/playlists/ui/sections/playlist-header-section";
import { VideosViewSection } from "@/modules/playlists/ui/sections/videos-view-section";

export default function VideosView({ playlistId }: { playlistId: string }) {
  return (
    <div className="max-w-screen-md mx-auto px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosViewSection playlistId={playlistId} />
    </div>
  );
}
