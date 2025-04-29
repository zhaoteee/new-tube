import { LikedVideosSection } from "@/modules/playlists/ui/sections/liked-videos-section";

export default function LikedView() {
  return (
    <div className="max-w-screen-md mx-auto px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liked</h1>
        <p className="text-xs text-muted-foreground">Videos you have liked</p>
      </div>
      <LikedVideosSection />
    </div>
  );
}
