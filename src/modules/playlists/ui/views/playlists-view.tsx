import { PlaylistsAddHeaderSection } from "@/modules/playlists/ui/sections/playlists-add-header-section";
import { PlaylistsVideosSection } from "@/modules/playlists/ui/sections/playlists-section";

export default function PlaylistsView() {
  return (
    <div className="max-w-[2400px] mx-auto px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistsAddHeaderSection />
      <PlaylistsVideosSection />
    </div>
  );
}
